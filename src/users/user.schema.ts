import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ enum: ['local', 'kakao'], required: true })
  provider: 'local' | 'kakao';

  // ─── 로컬 회원가입일 때만 필수 ───────────────────────────
  @Prop({
    required: function (this: User) {
      return this.provider === 'local';
    },
  })
  name?: string;

  @Prop({
    required: function (this: User) {
      return this.provider === 'local';
    },
    unique: true,
    sparse: true,
    lowercase: true,
  })
  email?: string;

  @Prop({
    required: function (this: User) {
      return this.provider === 'local';
    },
    unique: true,
    sparse: true,
  })
  username?: string;

  @Prop({
    required: function (this: User) {
      return this.provider === 'local';
    },
  })
  password?: string;

  // ─── 카카오 유저 전용 ─────────────────────────────────
  @Prop()
  socialId?: string;

  // ─── 프로필 플래그 ───────────────────────────────────
  @Prop({ default: true })
  isSubscriber: boolean;

  @Prop({ default: false })
  isPublisher: boolean;

  // (추가로, 소셜 로그인 여부 구분용)
  @Prop({ default: false })
  isSocial: boolean;

  // ─── 리프레시 토큰 저장용 (선택) ───────────────────────
  @Prop({ select: false })
  currentRefreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
