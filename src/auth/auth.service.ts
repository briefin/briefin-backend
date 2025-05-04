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
    private configService: ConfigService,
  ) {}

  /** 회원가입 */
  async signup(dto: SignupDto) {
    if (dto.provider === 'local') {
      if (!dto.password) {
        throw new BadRequestException('비밀번호는 필수값입니다.');
      }

      const exists = await this.userModel
        .exists({ username: dto.username })
        .exec();
      if (exists) {
        throw new ConflictException('이미 사용 중인 아이디입니다.');
      }

      const saltRounds = 10;
      const hash = await bcryptHash(dto.password, saltRounds);

      const createdUser = (await this.userModel.create({
        ...dto,
        password: hash,
      })) as UserDocument;
      // createdUser._id is a mongoose.Types.ObjectId
      const userId = createdUser._id; // ← now clearly a string
      return {
        _id: userId,
        isSubscriber: createdUser.isSubscriber,
        isPublisher: createdUser.isPublisher,
      };
    }

    // 카카오 가입도 동일하게 플래그를 기본값으로 돌려줍니다.
    const kakaoUser = await this.userModel.create({
      provider: 'kakao',
      socialId: dto.socialId,
    });
    const kakaoId = kakaoUser._id;
    return {
      _id: kakaoId,
      isSubscriber: kakaoUser.isSubscriber,
      isPublisher: kakaoUser.isPublisher,
    };
  }

  /** 로그인 → accessToken 리턴 */
  async login(dto: LoginDto): Promise<{
    accessToken: string;
    userId: string;
    isSubscriber: boolean;
    isPublisher: boolean;
  }> {
    const user = await this.userModel
      .findOne({ username: dto.username })
      .lean<{
        _id: Types.ObjectId;
        password: string;
        isSubscriber: boolean;
        isPublisher: boolean;
      }>()
      .exec();

    if (!user) {
      throw new UnauthorizedException('아이디 또는 비밀번호 오류');
    }

    const pwOk = await bcryptCompare(dto.password, user.password);
    if (!pwOk) {
      throw new UnauthorizedException('아이디 또는 비밀번호 오류');
    }

    const payload = {
      sub: user._id.toString(),
      isSubscriber: user.isSubscriber,
      isPublisher: user.isPublisher,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      userId: user._id.toString(),
      isSubscriber: user.isSubscriber,
      isPublisher: user.isPublisher,
    };
  }

  /** 카카오 유저 검증/가입 */
  async kakaoValidateUser(kakaoId: number): Promise<UserDocument> {
    const existingUser = await this.userModel
      .findOne({ socialId: kakaoId })
      .exec();
    if (existingUser) return existingUser;
    return this.userModel.create({
      provider: 'kakao',
      socialId: kakaoId,
    });
  }

  /** JWT 생성 (flags 포함) */
  generateAccessToken(user: UserDocument): string {
    const payload = {
      userId: user._id,
      isSubscriber: user.isSubscriber,
      isPublisher: user.isPublisher,
    };
    return this.jwtService.sign(payload);
  }

  /** refreshToken 생성 & 저장 */
  async generateRefreshToken(user: UserDocument): Promise<string> {
    const payload = {
      userId: user._id,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
    });

    const hashed = await bcryptHash(refreshToken, 10);
    await this.userModel
      .updateOne({ _id: user._id }, { currentRefreshToken: hashed })
      .exec();

    return refreshToken;
  }

  /** 리프레시 토큰으로 액세스 토큰 재발급 */
  async refresh(refreshToken: string): Promise<string> {
    let decoded: { sub: string };
    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET')!,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh-token');
    }

    const user = await this.userModel
      .findById(decoded.sub)
      .select('+currentRefreshToken')
      .exec();

    if (!user || !user.currentRefreshToken) {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
    }

    const ok = await bcryptCompare(refreshToken, user.currentRefreshToken);
    if (!ok) {
      throw new UnauthorizedException('Invalid refresh-token');
    }

    return this.generateAccessToken(user);
  }

  /** 카카오 로그인 후 토큰 발급 */
  async getJWT(kakaoId: number) {
    const user = await this.kakaoValidateUser(kakaoId);
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }
}
