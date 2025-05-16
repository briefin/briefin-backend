import {
  Controller,
  Post,
  Get,
  Delete, // ← 추가
  Req,
  Param, // ← 추가
  Body,
  UseGuards,
} from '@nestjs/common';
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

  @Delete(':publisherId')
  @ApiOperation({ summary: '내 퍼블리셔 프로필 삭제' })
  async deleteProfile(
    @Req() req: RequestWithUser,
    @Param('publisherId') publisherId: string,
  ) {
    await this.publisherService.deleteProfile(req.user.userId, publisherId);
    return { message: '퍼블리셔 프로필이 삭제되었습니다.' };
  }
}
