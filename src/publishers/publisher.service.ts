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

  /**
   * 내 퍼블리셔 프로필 삭제
   * @throws NotFoundException if not found or not owned by user
   */
  async deleteProfile(userId: string, publisherId: string): Promise<void> {
    const result = await this.publisherModel
      .findOneAndDelete({
        _id: new Types.ObjectId(publisherId),
        user: new Types.ObjectId(userId),
      })
      .exec();
    if (!result) {
      throw new NotFoundException(
        `Publisher with id ${publisherId} not found or not yours`,
      );
    }
  }

  /**
   * q 에 포함된 nickname, bio, 또는 정확한 id 로 퍼블리셔 검색
   */
  async searchPublishers(q: string): Promise<PublisherDocument[]> {
    return this.publisherModel
      .aggregate<PublisherDocument>([
        {
          $search: {
            index: 'publisherIndex',
            text: {
              query: q,
              path: ['nickname', 'bio'],
              fuzzy: { maxEdits: 1, prefixLength: 2 },
            },
          },
        },
        { $limit: 20 },
        {
          $project: {
            nickname: 1,
            bio: 1,
            score: { $meta: 'searchScore' },
          },
        },
      ])
      .exec();
  }

  /**
   * 해당 publisherId가 해당 userId의 것인지 확인 (소유 검증)
   */
  async isOwner(userId: string, publisherId: string): Promise<boolean> {
    const publisher = await this.publisherModel.findOne({
      _id: new Types.ObjectId(publisherId),
      user: new Types.ObjectId(userId),
    });

    return !!publisher; // 있으면 true, 없으면 false
  }
}
