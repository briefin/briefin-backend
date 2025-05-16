import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
//import { Magazine } from '../magazines/magazine.schema';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  /** 포스트 제목 */
  @Prop({ required: true })
  title: string;

  /** 포스트 썸네일 이미지 URL */
  @Prop({ type: String, required: false, select: true })
  description?: string;

  /** 포스트 컨텐츠(이미지 배열열) */
  @Prop({ required: true })
  contents: string[];

  /** 포스트 제작 퍼블리셔 */
  @Prop({ type: Types.ObjectId, ref: 'Publisher', required: true })
  publisher: Types.ObjectId;

  /** 발행 여부 */
  @Prop({ default: false, required: false })
  isPublished?: boolean;

  /** 속한 매거진 
  @Prop({ type: Types.ObjectId, ref: 'Magazine', required: true })
  magazine: Types.ObjectId;*/

  /** 조회 횟수 */
  @Prop({ default: 0, required: false })
  viewCount?: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);
