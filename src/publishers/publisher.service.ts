import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publisher, PublisherDocument } from './publisher.schema';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(
    @InjectModel(Publisher.name, 'publisherConnection')
    private readonly publisherModel: Model<PublisherDocument>,
  ) {}

  // 유저 ID로 Publisher + User 정보 조회
  async getByUserId(userId: string) {
    return this.publisherModel
      .findOne({ user: new Types.ObjectId(userId) })
      .populate('user')
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
      //.populate('user') // 필요시 추가
      .populate('publishedMagazines')
      .exec();

    if (!profile) {
      throw new NotFoundException('Publisher not found');
    }
    return profile;
  }

  // 프로필 조회
  async getProfile(publisherId: string): Promise<Publisher> {
    const profile = await this.publisherModel
      .findById(publisherId)
      //.populate('user') //다른 사람이 퍼블리셔 조회할 때는 필요 없을 것 같은데?
      //.populate('publishedMagazines')
      .exec();

    if (!profile) {
      throw new NotFoundException('Publisher not found');
    }
    return profile;
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
