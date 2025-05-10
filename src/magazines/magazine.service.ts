import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Magazine, MagazineDocument } from './magazine.schema';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';

@Injectable()
export class MagazineService {
  constructor(
    @InjectModel(Magazine.name, 'magazineConnection') // ← 두 번째 인자로 연결 이름
    private readonly magazineModel: Model<MagazineDocument>,
  ) {}

  // 매거진 생성
  // userId를 받아서 DTO + publisher 필드로 새 문서 생성
  async create(
    userId: string,
    createMagazineDto: CreateMagazineDto,
  ): Promise<Magazine> {
    const created = new this.magazineModel({
      ...createMagazineDto,
      publisher: userId, // 스키마에 맞게 필드 이름
    });
    return created.save();
  }

  // 내 매거진 목록 조회
  async findAll(userId: string): Promise<Magazine[]> {
    return this.magazineModel
      .find({ publisher: userId }) // 내 매거진만 조회
      .populate('publisher')
      .exec();
  }

  // 특정 매거진 상세 조회
  async findOne(userId: string, id: string): Promise<Magazine> {
    const magazine = await this.magazineModel
      .findOne({ _id: id, publisher: userId }) // publisher도 같이 검사
      .populate('publisher')
      .exec();

    if (!magazine) {
      throw new NotFoundException(`Magazine with id ${id} not found`);
    }
    return magazine;
  }

  // 매거진 수정
  async update(
    userId: string,
    id: string,
    updateMagazineDto: UpdateMagazineDto,
  ): Promise<Magazine> {
    const updated = await this.magazineModel
      .findOneAndUpdate({ _id: id, publisher: userId }, updateMagazineDto, {
        new: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Magazine with id ${id} not found`);
    }
    return updated;
  }

  // 매거진 삭제
  async remove(userId: string, id: string): Promise<void> {
    const result = await this.magazineModel
      .findOneAndDelete({ _id: id, publisher: userId })
      .exec();

    if (!result) {
      throw new NotFoundException(`Magazine with id ${id} not found`);
    }
  }
}
