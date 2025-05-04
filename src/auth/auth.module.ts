import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { User, UserSchema } from '../users/user.schema';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    // ➡️ userConnection DB 에서 users 스키마
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      'userConnection',
    ),
  ],
  providers: [AuthService, JwtStrategy, KakaoStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
