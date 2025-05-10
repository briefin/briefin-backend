import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Magazine } from '../magazines/magazine.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  /** 포스트 제목 */
  @Prop({ required: true })
  title: string;

  /** 포스트 내용 */
  @Prop({ required: true })
  content: string;

  /** 작성자(퍼블리셔) */
  @Prop({ type: Types.ObjectId, ref: 'Publisher', required: true })
  author: Types.ObjectId;

  /** 속한 매거진 */
  @Prop({ type: Types.ObjectId, ref: Magazine.name, required: true })
  magazine: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
