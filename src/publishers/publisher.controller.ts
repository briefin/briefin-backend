// src/publishers/publisher.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublisherService } from './publisher.service';
//import { PublisherDocument } from './publisher.schema';
import { PublicPublisherDto } from './dto/public-publisher.dto';

@ApiTags('publishers (공개)')
@Controller('publishers')
export class PublisherController {
  constructor(private readonly publisherService: PublisherService) {}

  @Get(':publisherId')
  @ApiOperation({ summary: '특정 퍼블리셔 공개 프로필 조회' })
  async getPublicProfile(
    @Param('publisherId') publisherId: string,
  ): Promise<PublicPublisherDto> {
    return this.publisherService.getPublicProfile(publisherId);
  }
}
