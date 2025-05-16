// src/magazines/magazine.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Request } from 'express';

import { MagazineService } from './magazine.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { PublisherService } from '../publishers/publisher.service';
import { JwtAuthGuard, JwtAuthUser } from 'src/auth/auth.guard';

@ApiBearerAuth('access-token')
@ApiTags('Magazines')
// 클래스 레벨에 Guard 를 걸면 모든 핸들러에 적용됩니다
@UseGuards(JwtAuthGuard)
@Controller('publishers/:publisherId/magazines')
export class MagazineController {
  constructor(
    private readonly magazineService: MagazineService,
    private readonly publisherService: PublisherService,
  ) {}

  /** 1) 매거진 생성 */
  @Post()
  @ApiOperation({ summary: '내 퍼블리셔 아래 매거진 생성' })
  async create(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('publisherId') publisherId: string,
    @Body() dto: CreateMagazineDto,
  ) {
    const publisher = await this.publisherService.getOneByUserAndId(
      req.user.userId,
      publisherId,
    );
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return this.magazineService.create(String(publisher._id), dto);
  }

  /** 2) 매거진 목록 조회 */
  @Get()
  @ApiOperation({ summary: '내 퍼블리셔 아래 매거진 전체 조회' })
  async findAll(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('publisherId') publisherId: string,
  ) {
    const publisher = await this.publisherService.getOneByUserAndId(
      req.user.userId,
      publisherId,
    );
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return this.magazineService.findAll(String(publisher._id));
  }

  /** 3) 매거진 상세 조회 */
  @Get(':magazineId')
  @ApiOperation({ summary: '매거진 상세 조회' })
  async findOne(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('publisherId') publisherId: string,
    @Param('magazineId') magazineId: string,
  ) {
    // optionally 권한체크도 넣고 싶다면 publisherService 로 확인
    return this.magazineService.findOne(magazineId);
  }

  /** 4) 매거진 수정 */
  @Put(':magazineId')
  @ApiOperation({ summary: '내 퍼블리셔 아래 특정 매거진 수정' })
  @ApiBody({
    description: '수정할 필드만 포함하여 전송',
    type: UpdateMagazineDto,
    examples: {
      titleOnly: {
        summary: '제목만 변경',
        value: { title: '가을호 매거진' },
      },
      full: {
        summary: '모두 변경',
        value: {
          title: '가을호 매거진',
          description: '풍성한 가을 특집 맛집 모음',
          coverImage: 'https://example.com/fall-cover.jpg',
          isPublished: true,
        },
      },
    },
  })
  async update(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('publisherId') publisherId: string,
    @Param('magazineId') magazineId: string,
    @Body() dto: UpdateMagazineDto,
  ) {
    const publisher = await this.publisherService.getOneByUserAndId(
      req.user.userId,
      publisherId,
    );
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return this.magazineService.update(String(publisher._id), magazineId, dto);
  }

  /** 5) 매거진 삭제 */
  @Delete(':magazineId')
  @ApiOperation({ summary: '내 퍼블리셔 아래 특정 매거진 삭제' })
  async remove(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('publisherId') publisherId: string,
    @Param('magazineId') magazineId: string,
  ) {
    const publisher = await this.publisherService.getOneByUserAndId(
      req.user.userId,
      publisherId,
    );
    if (!publisher) {
      throw new NotFoundException('Publisher not found');
    }
    return this.magazineService.remove(String(publisher._id), magazineId);
  }
}
