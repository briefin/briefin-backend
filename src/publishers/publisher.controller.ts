import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';

@ApiTags('publishers')
@Controller('publishers')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  // 퍼블리셔 프로필 생성
  @Post(':userId/profile')
  @ApiOperation({ summary: '퍼블리셔 프로필 생성' })
  async createProfile(
    @Param('userId') userId: string,
    @Body() createPublisherDto: CreatePublisherDto,
  ) {
    return this.publisherService.createProfile(userId, createPublisherDto);
  }

  // 퍼블리셔 상세 프로필 조회
  @Get(':publisherId')
  @ApiOperation({ summary: '퍼블리셔 상세 프로필 조회' })
  async getProfile(@Param('publisherId') publisherId: string) {
    // publisherId는 실제로는 userId가 아니라 publisher document의 _id일 수 있음
    // 만약 userId로 조회하려면 getByUserId를 사용해야 함
    const profile = await this.publisherService.getProfile(publisherId);
    if (!profile) throw new NotFoundException('Publisher not found');
    return profile;
  }
}
