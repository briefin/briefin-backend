import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
//import { Magazine } from '../magazines/magazine.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String, required: false })
  description?: string;

  /** 이미지 파일명 배열 */
  @Prop({ type: [String], required: true })
  images: string[]; // ✅ contents → images

  @Prop({ type: Types.ObjectId, ref: 'Publisher', required: true })
  publisher: Types.ObjectId;

  @Prop({ default: false })
  isPublished?: boolean;

  @Prop({ default: 0 })
  viewCount?: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
