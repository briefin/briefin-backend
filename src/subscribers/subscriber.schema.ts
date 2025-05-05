import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';

export type SubscriberDocument = Subscriber & Document;

@Schema({ timestamps: true })
export class Subscriber {
  /** User 컬렉션의 ObjectId (local/kakao 로그인 정보) */
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, unique: true })
  user: Types.ObjectId;

  /** 프로필 이미지 URL */
  @Prop()
  profileImage?: string;

  /** 닉네임 */
  @Prop({ required: true })
  nickname: string;

  /** 자기소개 */
  @Prop()
  bio?: string;

  /** 구독 중인 퍼블리셔 계정 리스트 */
  /*@Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  subscribedPublishers: Types.ObjectId[];*/

  /** 구독 중인 매거진 리스트 */
  /*@Prop({ type: [Types.ObjectId], ref: 'Magazine', default: [] })
  subscribedMagazines: Types.ObjectId[];*/

  /** 좋아요 누른 게시물 리스트 */
  /*Prop({ type: [Types.ObjectId], ref: 'Post', default: [] })
  likedPosts: Types.ObjectId[];*/

  /** 스크랩 폴더(ObjectId) 리스트 */
  /*@Prop({ type: [Types.ObjectId], ref: 'ScrapFolder', default: [] })
  scrapFolders: Types.ObjectId[];*/
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
