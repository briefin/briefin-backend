import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Magazine, MagazineDocument } from './magazine.schema';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { Publisher, PublisherDocument } from 'src/publishers/publisher.schema';

@Injectable()
export class MagazineService {
  constructor(
    @InjectModel(Magazine.name, 'magazineConnection') // ← 두 번째 인자로 연결 이름
    private readonly magazineModel: Model<MagazineDocument>,
    @InjectModel(Publisher.name, 'publisherConnection')
    private readonly publisherModel: Model<PublisherDocument>,
  ) {}

  // 매거진 생성
  // userId를 받아서 DTO + publisher 필드로 새 문서 생성
  async create(
    publisherId: string,
    createMagazineDto: CreateMagazineDto,
  ): Promise<Magazine> {
    const created = new this.magazineModel({
      ...createMagazineDto,
      publisher: publisherId, // 스키마에 맞게 필드 이름
    });
    return created.save();
  }

  // 내 매거진 목록 조회
  async findAll(publisherId: string): Promise<Magazine[]> {
    const magazines = await this.magazineModel
      .find({ publisher: publisherId }) // 내 매거진만 조회
      .lean()
      .exec();

    if (!magazines) throw new NotFoundException('Magazines are not found');
    try {
      const populatedMagazines = await this.magazineModel.populate(magazines, {
        path: 'publisher',
        model: this.publisherModel,
      });
      return populatedMagazines;
    } catch (error) {
      throw new InternalServerErrorException('Failed to populate publisher data');
    }
  }

  // 특정 매거진 상세 조회
  async findOne(id: string): Promise<Magazine> {
    const magazine = await this.magazineModel
      .findById(id)
      .lean()
      .exec();

    if (!magazine) throw new NotFoundException('Magazine is not found');

    try {
      const [populated] = await this.magazineModel.populate([magazine], {
        path: 'publisher',
        model: this.publisherModel, // ← 명시적으로 모델 지정!
      });
      return populated;
    } catch (error) {
      throw new InternalServerErrorException('Failed to populate publisher data');
    }
  }

  // 매거진 수정
  async update(
    publisherId: string,
    id: string,
    updateMagazineDto: UpdateMagazineDto,
  ): Promise<Magazine> {
    const updated = await this.magazineModel
      .findOneAndUpdate({ _id: id, publisher: publisherId }, updateMagazineDto, {
        new: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Magazine with id ${id} not found`);
    }
    return updated;
  }

  // 매거진 삭제
  async remove(publisherId: string, id: string): Promise<void> {
    const result = await this.magazineModel
      .findOneAndDelete({ _id: id, publisher: publisherId })
      .exec();

    if (!result) {
      throw new NotFoundException(`Magazine with id ${id} not found`);
    }
  }
}
