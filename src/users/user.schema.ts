import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ enum: ['local', 'kakao'], required: true })
  provider: 'local' | 'kakao';

  @Prop({ unique: true, sparse: true })
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

  @Prop()
  socialId?: string;

  @Prop({ enum: ['subscriber', 'publisher'], default: 'subscriber' })
  role: 'subscriber' | 'publisher';

  @Prop()
  isSocial?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
