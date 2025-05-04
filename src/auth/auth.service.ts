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

import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../users/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name, 'userConnection')
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
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
}
