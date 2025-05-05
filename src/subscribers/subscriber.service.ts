// src/subscriber/subscriber.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subscriber, SubscriberDocument } from './subscriber.schema';
//import { ScrapFolder, ScrapFolderDocument } from '../scrapfolders/scrapfolder.schema';
import { SubscriberDto } from './dto/subscriber.dto';

//import { CreateScrapFolderDto } from './dto/create-scrap-folder.dto';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectModel(Subscriber.name, 'subscriberConnection')
    private subModel: Model<SubscriberDocument>,
    //@InjectModel(ScrapFolder.name, 'userConnection')
    //private folderModel: Model<ScrapFolderDocument>,
  ) {}

  // 유저 ID로 Subscriber + User 정보 조회
  async getByUserId(userId: string) {
    return this.subModel.findOne({ user: userId }).populate('user').exec();
  }

  async createForUser(userId: string, nickname: string) {
    const sub = new this.subModel({ user: userId, nickname });
    return sub.save();
  }
  private generateRandomNickname(): string {
    // 예시 로직: user 뒤에 0~9999 사이의 숫자 붙이기
    return `user${Math.floor(Math.random() * 10000)}`;
  }

  private generateRandomProfileImageUrl(): string {
    // API 서버의 기본 URL은 환경변수로 관리
    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
    // /static/default-avatar.png 를 반환
    return `${baseUrl}/static/default-avatar.png`;
  }

  // 프로필 생성
  async initProfile(userId: string) {
    const nickname = this.generateRandomNickname();
    const profileImage = this.generateRandomProfileImageUrl();
    const created = await this.subModel.create({
      user: new Types.ObjectId(userId),
      nickname,
      profileImage,
      bio: '',
    });
    return created;
  }

  // 프로필 조회
  async getProfile(userId: string) {
    const found = await this.subModel.findOne({ user: userId }).exec();
    if (!found) throw new NotFoundException('Subscriber not found');
    return found;
  }

  // 프로필 수정
  async updateProfile(userId: string, dto: SubscriberDto) {
    const updated = await this.subModel
      .findOneAndUpdate({ user: userId }, dto, { new: true })
      .exec();
    if (!updated) throw new NotFoundException('Subscriber not found');
    return updated;
  }

  // 퍼블리셔 구독 추가
  /*async subscribePublisher(userId: string, publisherId: string) {
    return this.subModel.findOneAndUpdate(
      { user: userId },
      { $addToSet: { subscribedPublishers: publisherId } },
      { new: true },
    );
  }

  // 게시물 좋아요
  async likePost(userId: string, postId: string) {
    return this.subModel.findOneAndUpdate(
      { user: userId },
      { $addToSet: { likedPosts: postId } },
      { new: true },
    );
  }*/

  // 스크랩 폴더 생성
  /*async createFolder(userId: string, dto: CreateScrapFolderDto) {
    const subscriber = await this.getProfile(userId);
    const folder = await this.folderModel.create({
      name: dto.name,
      owner: subscriber._id,
      posts: [],
    });
    // subscriber.scrapFolders에도 추가
    await this.subModel.updateOne(
      { user: userId },
      { $push: { scrapFolders: folder._id } },
    );
    return folder;
  }

  // 스크랩 폴더 리스트 조회
  async getFolders(userId: string) {
    const subscriber = await this.getProfile(userId);
    return this.folderModel.find({ owner: subscriber._id }).exec();
  }

  // 스크랩 폴더에 게시물 추가
  async addPostToFolder(folderId: string, postId: string) {
    return this.folderModel.findByIdAndUpdate(
      folderId,
      { $addToSet: { posts: postId } },
      { new: true },
    ).exec();
  }*/
}
