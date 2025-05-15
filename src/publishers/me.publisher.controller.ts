// src/publishers/me.publisher.controller.ts
import { Controller, Post, Get, Req, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { PublisherDocument } from './publisher.schema';

@ApiTags('publishers (내)')
@ApiBearerAuth('access-token')
@Controller('me/publishers')
@UseGuards(JwtAuthGuard)
export class MePublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Post()
  @ApiOperation({ summary: '내 퍼블리셔 프로필 생성' })
  createProfile(@Req() req: RequestWithUser, @Body() dto: CreatePublisherDto) {
    return this.publisherService.createProfile(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '내 모든 퍼블리셔 목록 조회' })
  async getMine(@Req() req: RequestWithUser): Promise<PublisherDocument[]> {
    // ← 배열 반환
    return this.publisherService.getByUserId(req.user.userId);
  }
}
