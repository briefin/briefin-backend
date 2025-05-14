import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type PublisherDocument = Publisher & Document;

@Schema({ timestamps: true })
export class Publisher {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: String, required: false })
  profileImage?: string;

  @Prop({ type: String, required: true })
  nickname: string;

  @Prop({ type: String, required: false })
  bio?: string;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Subscriber',
    required: false,
    default: [],
  })
  subscribers?: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'Magazine',
    required: false,
    default: [],
  })
  publishedMagazines?: Types.ObjectId[];
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);
