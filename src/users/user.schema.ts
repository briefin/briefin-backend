import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ enum: ['local', 'kakao'], required: true })
  provider: 'local' | 'kakao';

  @Prop() // 소셜 로그인 시만 사용
  socialId?: string;

  @Prop({
    required(this: User) {
      return this.provider === 'local';
    },
    unique: true,
  })
  username?: string;

  @Prop({
    required(this: User) {
      return this.provider === 'local';
    },
  })
  password?: string;

  @Prop({ enum: ['subscriber', 'publisher'], default: 'subscriber' })
  role?: 'subscriber' | 'publisher';

  @Prop()
  isSocial?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
