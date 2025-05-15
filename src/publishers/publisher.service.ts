import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publisher, PublisherDocument } from './publisher.schema';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { PublicPublisherDto } from './dto/public-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(
    @InjectModel(Publisher.name, 'publisherConnection')
    private readonly publisherModel: Model<PublisherDocument>,
  ) {}

  // 유저 ID로 Publisher + User 정보 조회
  async getByUserId(userId: string): Promise<PublisherDocument[]> {
    return this.publisherModel
      .find({ user: new Types.ObjectId(userId) }) // ← find() 로 배열 반환
      .populate('user') // User 스키마의 모든 필드 채워 넣기
      .exec();
  }

  /**
   * userId(내 계정)에 속한 publisherId인지 검증하고,
   * 맞으면 PublisherDocument, 아니면 null 반환
   */
  async getOneByUserAndId(
    userId: string,
    publisherId: string,
  ): Promise<PublisherDocument | null> {
    return this.publisherModel
      .findOne({
        _id: new Types.ObjectId(publisherId),
        user: new Types.ObjectId(userId),
      })
      .exec();
  }

  // 랜덤 프로필 이미지 생성
  private generateRandomProfileImageUrl(): string {
    const baseUrl = process.env.BASE_URL || 'http://localhost:4000';
    return `${baseUrl}/static/default-avatar.png`;
  }

  // 프로필 생성  + Magazine에서 create와 다르게 await 사용함. 비교를 위해 고치지 않고 이렇게 남겨둠
  async createProfile(
    userId: string,
    createPublisherDto: CreatePublisherDto,
  ): Promise<Publisher> {
    const created = await this.publisherModel.create({
      user: new Types.ObjectId(userId),
      nickname: createPublisherDto.nickname,
      profileImage:
        createPublisherDto.profileImage || this.generateRandomProfileImageUrl(), //이미지 없을 때 랜덤 이미지지
      bio: createPublisherDto.bio,
      subscribers: [], // 초기에는 빈 배열
      publishedMagazines: [], // 초기에는 빈 배열
    });
    return created;
  }

  // userId로 Publisher 프로필 조회
  async getProfileByUserId(userId: string): Promise<Publisher> {
    const profile = await this.publisherModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('user') // 필요시 추가
      .populate('publishedMagazines')
      .exec();

    if (!profile) {
      throw new NotFoundException('Publisher not found');
    }
    return profile;
  }

  // 프로필 조회
  async getPublicProfile(publisherId: string): Promise<PublicPublisherDto> {
    const profile = await this.publisherModel
      .findById(publisherId)
      .select('nickname bio profileImage subscribers publishedMagazines')
      .populate({ path: 'subscribers', select: '_id' })
      .populate({
        path: 'publishedMagazines',
        select: '_id title coverImage',
      })
      .lean<PublicPublisherDto>()
      .exec();

    if (!profile) {
      throw new NotFoundException('Publisher not found');
    }

    return {
      nickname: profile.nickname,
      bio: profile.bio,
      subscriberCount: profile.subscribers?.length ?? 0,
      profileImage: profile.profileImage,
      publishedMagazines: profile.publishedMagazines,
    };
  }

  // 프로필 수정
  async updateProfile(userId: string, updatePublisherDto: UpdatePublisherDto) {
    const updateData: Partial<Publisher> = {};

    if (updatePublisherDto.nickname !== undefined)
      updateData.nickname = updatePublisherDto.nickname;
    if (updatePublisherDto.profileImage !== undefined)
      updateData.profileImage = updatePublisherDto.profileImage;
    if (updatePublisherDto.bio !== undefined)
      updateData.bio = updatePublisherDto.bio;

    const updated = await this.publisherModel
      .findOneAndUpdate(
        { user: new Types.ObjectId(userId) },
        { $set: updateData },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updated) throw new NotFoundException('Publisher not found');
    return updated;
  }

  /**
   * 여러 개의 Publisher를 _id 배열로 한 번에 조회
   */
  async findByIds(ids: string[]): Promise<PublisherDocument[]> {
    // string[] → ObjectId[]
    const objectIds = ids.map((id) => new Types.ObjectId(id));
    return this.publisherModel
      .find({ _id: { $in: objectIds } })
      .lean() // lean 쓰면 순수 JS 객체 반환
      .exec();
  }

  /*
  // 매거진 추가
  async addMagazine(publisherId: string, magazineId: string) {
    return this.publisherModel.findOneAndUpdate(
      { _id: new Types.ObjectId(publisherId) },
      { $addToSet: { publishedMagazines: new Types.ObjectId(magazineId) } },
      { new: true },
    );
  }

  // 매거진 제거
  async removeMagazine(publisherId: string, magazineId: string) {
    return this.publisherModel.findOneAndUpdate(
      { _id: new Types.ObjectId(publisherId) },
      { $pull: { publishedMagazines: new Types.ObjectId(magazineId) } },
      { new: true },
    );
  }

  // 구독자 목록 조회
  async getSubscribers(publisherId: string) {
    const publisher = await this.publisherModel
      .findById(publisherId)
      .populate('subscribers')
      .exec();
    
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    
    return publisher.subscribers;
  }

  // 발행한 매거진 목록 조회
  async getPublishedMagazines(publisherId: string) {
    const publisher = await this.publisherModel
      .findById(publisherId)
      .populate('publishedMagazines')
      .exec();
    
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    
    return publisher.publishedMagazines;
  }
  */
}
