import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { provider, username, password, socialId } = createUserDto;

    // 조건별 유효성 검사
    if (provider === 'local') {
      if (!username || !password) {
        throw new BadRequestException(
          'Local login requires username and password.',
        );
      }
    }

    if (provider === 'kakao') {
      if (!socialId) {
        throw new BadRequestException('Kakao login requires socialId.');
      }
    }

    // 유저 생성 데이터 구성
    const userData: Partial<User> = {
      provider,
      role: 'subscriber',
      isSocial: provider !== 'local',
    };

    if (provider === 'local') {
      userData.username = username;
      userData.password = password; // TODO: 실제론 hash 처리 권장
    } else if (provider === 'kakao') {
      userData.socialId = socialId;
    }

    const user = new this.userModel(userData);
    return user.save();
  }

  async setRole(userId: string, role: 'subscriber' | 'publisher') {
    return this.userModel.findByIdAndUpdate(userId, { role }, { new: true });
  }
}
