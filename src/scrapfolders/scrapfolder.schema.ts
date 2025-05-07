import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Subscriber } from '../subscribers/subscriber.schema';

export type ScrapFolderDocument = ScrapFolder & Document;

@Schema({ timestamps: true })
export class ScrapFolder {
  /** 스크랩북 명 자유롭게 설정 */
  @Prop({ required: true })
  name: string;

  /** 어느 구독자(subscriber) 소유인지 */
  @Prop({ type: Types.ObjectId, ref: Subscriber.name, required: true })
  owner: Types.ObjectId;

  /** 스크랩북 설명 */
  @Prop()
  description?: string;

  /** 스크랩북 커버 이미지 */
  @Prop()
  coverImage?: string;

  /** 이 폴더에 스크랩해둔 게시물 ID 리스트 */
  /*@Prop({ type: [Types.ObjectId], ref: 'Post', default: [] })
  posts: Types.ObjectId[];*/
}

export const ScrapFolderSchema = SchemaFactory.createForClass(ScrapFolder);
