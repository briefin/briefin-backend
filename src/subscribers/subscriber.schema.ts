import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';
import { Publisher } from '../publishers/publisher.schema';
//import { Magazine } from '../magazines/magazine.schema';
//import { Post } from '../posts/post.schema';
import { ScrapFolder } from '../scrapfolders/scrapfolder.schema';

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
  @Prop({ type: [Types.ObjectId], ref: Publisher.name, default: [] })
  subscribedPublishers: Types.ObjectId[];

  /** 좋아요 누른 게시물 리스트 */
  /*Prop({ type: [Types.ObjectId], ref: Post.name, default: [] })
  likedPosts: Types.ObjectId[];*/

  /** 스크랩 폴더(ObjectId) 리스트 */
  @Prop({ type: [Types.ObjectId], ref: ScrapFolder.name, default: [] })
  scrapFolders: Types.ObjectId[];

  /**
   * 컨텐츠 소비 유형 (구독자 페르소나 중 하나)
   * → AI가 사용자의 소비 이력을 분석해 자동으로 채워 넣습니다.
   */
  @Prop({
    type: String,
    enum: [
      '호기심여우', // 로컬/맛집 스캐너
      '다리많은문어', // 시사/경제 다중탭러
      '은근깊은고양이', // 문학/에세이 애호가
      '수다쟁이앵무', // 인터뷰/연예 탐닉자
      '디자인곰', // 디자인/패션 감성수집가
      '배움펭귄', // 교육/영화/음악 깊이덕후
      '눈밝은토끼', // 감각적 몰입러
    ],
    default: null,
  })
  consumeType?: string | null;
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber);
