// src/subscriber/subscriber.controller.ts
import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberDto } from './dto/subscriber.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard, JwtAuthUser } from '../auth/auth.guard';

@ApiTags('Subscribers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('me')
export class SubscriberController {
  constructor(private readonly svc: SubscriberService) {}

  // 1) 최초 가입 직후 자동 호출
  @Post('subscriber')
  @ApiOperation({ summary: 'subscriber 프로필 생성' })
  async initProfile(@Req() req: Request & { user: JwtAuthUser }) {
    const profile = await this.svc.initProfile(req.user.userId);
    return { message: '기본 프로필이 생성되었습니다.', data: profile };
  }

  // 2) 구독자 프로필 조회
  @Get('subscriber/profile')
  @ApiOperation({ summary: 'subscriber 프로필 조회' })
  async getProfile(@Req() req: Request & { user: JwtAuthUser }) {
    const profile = await this.svc.getProfile(req.user.userId);
    return { message: '프로필을 조회했습니다.', data: profile };
  }

  // 3) 구독자 프로필 수정
  @Put('subscriber/profile')
  @ApiOperation({ summary: 'subscriber 프로필 수정' })
  async updateProfile(
    @Req() req: Request & { user: JwtAuthUser },
    @Body() dto: SubscriberDto,
  ) {
    const updated = await this.svc.updateProfile(req.user.userId, dto);
    return { message: '프로필이 업데이트되었습니다.', data: updated };
  }

  // 4) 퍼블리셔 구독하기
  @Post('subscribe/:publisherId')
  @ApiOperation({ summary: '퍼블리셔 구독하기' })
  async subscribePublisher(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('publisherId') publisherId: string,
  ) {
    const sub = await this.svc.subscribePublisher(req.user.userId, publisherId);
    return { message: '구독 완료되었습니다.', data: sub };
  }

  // 5) 구독 중인 퍼블리셔 목록 조회
  @Get('subscriptions/publishers')
  @ApiOperation({ summary: '구독 중인 퍼블리셔 목록 조회' })
  async getSubscribedPublishers(@Req() req: Request & { user: JwtAuthUser }) {
    const pubs = await this.svc.getSubscribedPublishers(req.user.userId);
    return {
      message: '구독 중인 퍼블리셔 목록입니다.',
      data: pubs,
    };
  }

  // 6) 취향 분석 프로필 조회
  @Get('preferences/profile')
  @ApiOperation({ summary: '취향 분석 프로필 조회' })
  async getPreferenceProfile(@Req() req: Request & { user: JwtAuthUser }) {
    const pref = await this.svc.getPreferenceProfile(req.user.userId);
    return { message: '취향 분석 정보입니다.', data: pref };
  }
}
