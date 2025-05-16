// src/magazines/magazine.service.ts
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Magazine, MagazineDocument } from './magazine.schema';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { Publisher, PublisherDocument } from '../publishers/publisher.schema';

@Injectable()
export class MagazineService {
  constructor(
    @InjectModel(Magazine.name, 'magazineConnection')
    private readonly magazineModel: Model<MagazineDocument>,
    @InjectModel(Publisher.name, 'publisherConnection')
    private readonly publisherModel: Model<PublisherDocument>,
  ) {}

  /** 매거진 생성 */
  async create(
    publisherId: string,
    createMagazineDto: CreateMagazineDto,
  ): Promise<MagazineDocument> {
    const created = new this.magazineModel({
      ...createMagazineDto,
      publisher: publisherId,
    });
    return created.save();
  }

  /** 내 매거진 목록 조회 */
  async findAll(publisherId: string): Promise<MagazineDocument[]> {
    const magazines = await this.magazineModel
      .find({ publisher: publisherId })
      .select('-__v') // 불필요 필드 제외
      .lean()
      .exec();

    if (!magazines) {
      throw new NotFoundException('No magazines found');
    }

    try {
      // publisher 필드만 populate
      return await this.magazineModel.populate(magazines, {
        path: 'publisher',
        model: this.publisherModel,
      });
    } catch {
      throw new InternalServerErrorException('Failed to populate publisher');
    }
  }

  /** 매거진 상세 조회 */
  async findOne(id: string): Promise<MagazineDocument> {
    const magazine = await this.magazineModel
      .findById(id)
      .select('-__v')
      .lean()
      .exec();

    if (!magazine) {
      throw new NotFoundException('Magazine not found');
    }

    try {
      const [populated] = await this.magazineModel.populate([magazine], {
        path: 'publisher',
        model: this.publisherModel,
      });
      return populated;
    } catch {
      throw new InternalServerErrorException('Failed to populate publisher');
    }
  }

  /** 매거진 수정 */
  async update(
    publisherId: string,
    id: string,
    updateMagazineDto: UpdateMagazineDto,
  ): Promise<MagazineDocument> {
    const updated = await this.magazineModel
      .findOneAndUpdate(
        { _id: id, publisher: publisherId },
        updateMagazineDto,
        { new: true },
      )
      .select('-__v')
      .exec();

    if (!updated) {
      throw new NotFoundException(`Magazine with id ${id} not found`);
    }
    return updated;
  }

  /** 매거진 삭제 */
  async remove(publisherId: string, id: string): Promise<void> {
    const result = await this.magazineModel
      .findOneAndDelete({ _id: id, publisher: publisherId })
      .exec();

    if (!result) {
      throw new NotFoundException(`Magazine with id ${id} not found`);
    }
  }
}
