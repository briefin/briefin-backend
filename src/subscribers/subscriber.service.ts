// src/subscriber/subscriber.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscriber, SubscriberDocument } from './subscriber.schema';
import {
  ScrapFolder,
  ScrapFolderDocument,
} from '../scrapfolders/scrapfolder.schema';
import { SubscriberDto } from './dto/subscriber.dto';
import { Publisher, PublisherDocument } from '../publishers/publisher.schema';
//import { PreferenceProfile } from './dto/preference-profile.dto';
import { CreateScrapFolderDto } from '../scrapfolders/dto/create-scrapfolder.dto';
import { UpdateScrapFolderDto } from '../scrapfolders/dto/update-scrapfolder.dto';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectModel(Subscriber.name, 'subscriberConnection')
    private subModel: Model<SubscriberDocument>,
    @InjectModel(ScrapFolder.name, 'scrapfolderConnection')
    private folderModel: Model<ScrapFolderDocument>,
    @InjectModel(Publisher.name, 'publisherConnection')
    private pubModel: Model<PublisherDocument>,
  ) {}

  // 기존 메서드들…
  async getByUserId(userId: string) {
    return this.subModel.findOne({ user: userId }).populate('user').exec();
  }

  async createForUser(userId: string, nickname: string) {
    const sub = new this.subModel({ user: userId, nickname });
    return sub.save();
  }

  private generateRandomNickname(): string {
    return `user${Math.floor(Math.random() * 10000)}`;
  }

  private generateRandomProfileImageUrl(): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
    return `${baseUrl}/static/default-avatar.png`;
  }

  async initProfile(userId: string) {
    const nickname = this.generateRandomNickname();
    const profileImage = this.generateRandomProfileImageUrl();
    const created = await this.subModel.create({
      user: new Types.ObjectId(userId),
      nickname,
      profileImage,
      bio: '',
      // 아래 필드들이 스키마에 정의되어 있어야 합니다.
      subscriptions: [],
      likedPosts: [],
    });
    return created;
  }

  async getProfile(userId: string): Promise<SubscriberDocument> {
    const profile = await this.subModel
      .findOne({ user: new Types.ObjectId(userId) })
      .exec();
    if (!profile) throw new NotFoundException('Subscriber not found');
    return profile;
  }

  async updateProfile(userId: string, dto: SubscriberDto) {
    const updateData: Partial<Subscriber> = {};
    if (dto.nickname !== undefined) updateData.nickname = dto.nickname;
    if (dto.profileImage !== undefined)
      updateData.profileImage = dto.profileImage;
    if (dto.bio !== undefined) updateData.bio = dto.bio;

    const updated = await this.subModel
      .findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Subscriber not found');
    return updated;
  }

  // — 신규 메서드들 —
  /** 7) 내 스크랩 폴더 조회 */
  async getFolders(userId: string): Promise<ScrapFolderDocument[]> {
    // 1) SubscriberDocument를 userId로 조회
    const sub = await this.getProfile(userId);
    // 2) owner 필드가 subscriber._id 이므로, _id 로 조회
    return this.folderModel.find({ owner: sub._id }).exec();
  }

  /** 구독 중인 퍼블리셔 목록 조회 */

  // src/subscriber/subscriber.service.ts

  /** 내가 구독 중인 퍼블리셔 목록 조회 */
  async getSubscribedPublishers(userId: string): Promise<PublisherDocument[]> {
    // 1) Subscriber 문서부터 꺼내고
    const sub = await this.subModel
      .findOne({ user: new Types.ObjectId(userId) })
      .exec();
    if (!sub) throw new NotFoundException('Subscriber not found');

    // 2) ID 목록만 빼 내서
    const publisherIds = sub.subscribedPublishers ?? [];
    if (publisherIds.length === 0) return [];

    // 3) 그 ID 목록으로 publisherConnection 에 등록된 Publisher 를 한 번에 조회
    return this.pubModel.find({ _id: { $in: publisherIds } }).exec();
  }

  /**
   * 취향 분석 프로필 조회
   * 예: 좋아요, 구독, 스크랩 폴더 수 집계
   */
  /** 취향 분석 프로필 조회 */

  // 페르소나 후보 목록
  private readonly consumeTypes = [
    '호기심여우',
    '다리많은문어',
    '은근깊은고양이',
    '수다쟁이앵무',
    '디자인곰',
    '배움펭귄',
    '눈밝은토끼',
  ];

  // 랜덤 personas 생성기
  private generateRandomConsumeType(): string {
    const i = Math.floor(Math.random() * this.consumeTypes.length);
    return this.consumeTypes[i];
  }

  /**
   * 취향 분석 프로필 조회
   * 좋아요·구독·스크랩 개수와 함께
   * consumeType이 null이면 랜덤으로 하나 뽑아서 채웁니다.
   */
  async getPreferenceProfile(userId: string): Promise<{
    nickname: string;
    subscribedPublishersCount: number;
    scrapFoldersCount: number;
    consumeType: string;
  }> {
    const sub = await this.getProfile(userId);

    // 스크랩 폴더 개수
    const scrapFoldersCount = Array.isArray(sub.scrapFolders)
      ? sub.scrapFolders.length
      : await this.folderModel.countDocuments({ owner: sub.nickname });

    // 퍼블리셔 구독 개수
    const subscribedPublishersCount = Array.isArray(sub.subscribedPublishers)
      ? sub.subscribedPublishers.length
      : 0;

    // consumeType이 null이면 랜덤으로 뽑아서 저장
    let consumeType = sub.consumeType;
    if (!consumeType) {
      consumeType = this.generateRandomConsumeType();
      sub.consumeType = consumeType;
      await sub.save(); // DB에도 반영
    }

    return {
      nickname: sub.nickname,
      subscribedPublishersCount,
      scrapFoldersCount,
      consumeType, // 이제 항상 문자열이 보장됩니다
    };
  }

  /**
   * 스크랩 폴더 생성
   */
  async createFolder(
    userId: string,
    dto: CreateScrapFolderDto,
  ): Promise<ScrapFolderDocument> {
    const sub = await this.getProfile(userId);
    const folder = new this.folderModel({
      owner: sub._id, // ← 여기
      name: dto.name,
      description: dto.description,
      coverImage: dto.coverImage,
    });
    return folder.save();
  }
  // src/subscriber/subscriber.service.ts

  /** 스크랩 폴더 수정 */
  async updateFolder(
    userId: string,
    folderId: string,
    dto: UpdateScrapFolderDto,
  ): Promise<ScrapFolderDocument> {
    // 1) 먼저 Subscriber 문서를 가져온다
    const subscriber = await this.getProfile(userId);

    // 2) folderId → ObjectId
    const folderOid = new Types.ObjectId(folderId);

    // 3) owner 는 Subscriber._id 를 써서 매칭
    const updated = await this.folderModel
      .findOneAndUpdate(
        { _id: folderOid, owner: subscriber._id },
        { $set: dto },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException('Scrap folder not found');
    }
    return updated;
  }

  /**
   * 특정 퍼블리셔를 구독합니다.
   * 1) Subscriber.subscribedPublishers에 publisherId 추가
   * 2) Publisher.subscribers에 subscriber._id 추가
   */
  /**
   * userId(Subscriber.user) 가 특정 publisherId를 구독하게 합니다.
   */
  async subscribePublisher(
    userId: string,
    publisherId: string,
  ): Promise<SubscriberDocument> {
    // 1) Subscriber 조회
    const sub = await this.subModel
      .findOne({ user: new Types.ObjectId(userId) })
      .exec();
    if (!sub) throw new NotFoundException('Subscriber not found');

    // 2) Publisher 조회
    const pub = await this.pubModel
      .findById(new Types.ObjectId(publisherId))
      .exec();
    if (!pub) throw new NotFoundException('Publisher not found');

    // 3) 우리가 비교/추가할 ObjectId 인스턴스 미리 생성
    const publisherOid = new Types.ObjectId(publisherId);
    const subscriberOid = sub._id as Types.ObjectId;

    // 4) 컴파일러용 안전장치: 절대 undefined 가 될 수 없음을 보장
    sub.subscribedPublishers = sub.subscribedPublishers ?? [];
    pub.subscribers = pub.subscribers ?? [];

    // 5) Subscriber → Publisher
    if (!sub.subscribedPublishers.some((id) => id.equals(publisherOid))) {
      sub.subscribedPublishers.push(publisherOid);
      await sub.save();
    }

    // 6) Publisher → Subscriber
    if (!pub.subscribers.some((id) => id.equals(subscriberOid))) {
      pub.subscribers.push(subscriberOid);
      await pub.save();
    }

    return sub;
  }
}
