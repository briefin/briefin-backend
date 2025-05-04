import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, 'userConnection')
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService, // refreshToken 시 필요하다면
  ) {}

  /** 회원가입 */
  async signup(dto: SignupDto) {
    if (dto.provider === 'local') {
      // ① runtime guard
      if (!dto.password) {
        throw new BadRequestException('비밀번호는 필수값입니다.');
      }

      // ② username 중복 확인
      const exists = await this.userModel
        .exists({ username: dto.username })
        .exec();
      if (exists) {
        throw new ConflictException('이미 사용 중인 아이디입니다.');
      }

      // ③ 해싱 (bcrypt/promises → always returns Promise<string>)
      const saltRounds = 10;
      const hash = await bcryptHash(dto.password, saltRounds);

      const createdUser = (await this.userModel.create({
        ...dto,
        password: hash,
      })) as UserDocument;
      // createdUser._id is a mongoose.Types.ObjectId
      const userId = createdUser._id; // ← now clearly a string
      return { _id: userId };
    }
    return {};
  }

  /** 로그인 → accessToken 리턴 */
  // 로컬 로그인입니다.
  // 카카오 로그인은 카카오 전략에서 처리합니다.
  async login(dto: LoginDto) {
    // .lean() returns any by default, so re-cast into your interface
    const user = await this.userModel
      .findOne({ username: dto.username })
      .lean<{
        _id: Types.ObjectId;
        password: string;
        role: 'subscriber' | 'publisher';
      }>() // ← 여기서 반환 타입을 명시
      .exec();
    if (!user) throw new UnauthorizedException('아이디 또는 비밀번호 오류');

    const pwOk: boolean = await bcryptCompare(dto.password, user.password);
    if (!pwOk) throw new UnauthorizedException('아이디 또는 비밀번호 오류');

    // Mongoose documents have a virtual `id: string` (i.e. `._id.toString()`)
    const payload = {
      sub: user._id.toString(), // ← Typed as string
      role: user.role, // ← Typed correctly
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      userId: user._id.toString(), // ← Typed as string
      role: user.role, // ← Typed correctly
    };
  }
  /** 카카오 유저 검증/가입 */
  async kakaoValidateUser(kakaoId: number): Promise<UserDocument> {
    // 1) MongoDB에서 kakaoId로 조회 (UserDocument | null 타입)
    const existingUser = await this.userModel.findOne({ kakaoId }).exec();

    if (existingUser) {
      // 이미 가입된 유저가 있으면 그대로 반환
      return existingUser;
    }

    // 2) 없으면 새로 생성
    const newUser = await this.userModel.create({
      kakaoId,
      provider: 'kakao',
    });

    return newUser;
  }
  /** 카카오 로그인 후 accessToken, refreshToken 생성 */
  generateAccessToken(user: UserDocument): string {
    const payload = {
      userId: user._id,
    };
    return this.jwtService.sign(payload);
  }

  /** refreshToken 생성 */
  // refreshToken은 DB에 저장하고, 클라이언트에게는 JWT로 전달합니다.
  async generateRefreshToken(user: UserDocument): Promise<string> {
    const payload = {
      userId: user._id,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    const saltOrRounds = 10;
    const currentRefreshToken = bcryptHash(refreshToken, saltOrRounds);

    await this.userModel
      .updateOne(
        { _id: user._id },
        { $set: { currentHashedRefreshToken: currentRefreshToken } },
      )
      .exec();

    // 5) 실제 클라이언트에 전달할 토큰 반환
    return refreshToken;
  }
  /** 클라이언트에서 받은 refreshToken으로 유효성 검사 → 새로운 accessToken 반환 */
  async refresh(refreshToken: string): Promise<string> {
    try {
      // 1) JWT 검증 → 반환 타입을 명시
      const decodedRefreshToken = this.jwtService.verify<{
        userId: string;
      }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      });
      const userId = decodedRefreshToken.userId;

      // 2) DB에서 User 객체 가져오기
      const user = await this.userModel
        .findById(userId)
        .select('+currentRefreshToken') // 스키마에 select: false 처리해뒀다면 ‘+’로 include
        .exec();

      if (!user || !user.currentRefreshToken) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
      }

      // 3) 토큰 일치 여부 이차 검증
      const isRefreshTokenMatching = await bcryptCompare(
        refreshToken,
        user.currentRefreshToken,
      );
      if (!isRefreshTokenMatching) {
        throw new UnauthorizedException('Invalid refresh-token');
      }

      // 4) 새로운 accessToken 생성
      return this.generateAccessToken(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh-token');
    }
  }
  /** 카카오 로그인 후 accessToken, refreshToken 생성 */
  async getJWT(kakaoId: number) {
    const user = await this.kakaoValidateUser(kakaoId); // 카카오 정보 검증 및 회원가입 로직
    const accessToken = this.generateAccessToken(user); // AccessToken 생성
    const refreshToken = await this.generateRefreshToken(user); // refreshToken 생성
    return { accessToken, refreshToken };
  }
}
