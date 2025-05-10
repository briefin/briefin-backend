import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// import { Publisher } from '../publishers/publisher.schema';
import { Subscriber } from '../subscribers/subscriber.schema';

export type MagazineDocument = Magazine & Document;

@Schema({ timestamps: true })
export class Magazine {
  /** 매거진 제목 */
  @Prop({ required: true })
  title: string;

  /** 매거진 설명 */
  @Prop()
  description?: string;

  /** 소속 퍼블리셔 */
  /*@Prop({ type: Types.ObjectId, ref: Publisher.name, required: true })
  publisher: Types.ObjectId;*/

  /** 매거진 커버 이미지 URL */
  @Prop()
  coverImage?: string;

  /** 발행 여부 */
  @Prop({ default: false })
  isPublished: boolean;

  /** 구독자 리스트 */
  @Prop({ type: [Types.ObjectId], ref: Subscriber.name, default: [] })
  subscribers: Types.ObjectId[];
}

export const MagazineSchema = SchemaFactory.createForClass(Magazine);
