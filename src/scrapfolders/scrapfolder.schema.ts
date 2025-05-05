import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ScrapFolderDocument = ScrapFolder & Document;

@Schema({ timestamps: true })
export class ScrapFolder {
  /** 폴더명을 자유롭게 설정 */
  @Prop({ required: true })
  name: string;

  /** 어느 구독자(subscriber) 소유인지 */
  @Prop({ type: Types.ObjectId, ref: 'Subscriber', required: true })
  owner: Types.ObjectId;

  /** 이 폴더에 스크랩해둔 게시물 ID 리스트 */
  @Prop({ type: [Types.ObjectId], ref: 'Post', default: [] })
  posts: Types.ObjectId[];
}

export const ScrapFolderSchema = SchemaFactory.createForClass(ScrapFolder);
