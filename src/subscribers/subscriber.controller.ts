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
import { CreateScrapFolderDto } from '../scrapfolders/dto/create-scrapfolder.dto';
import { UpdateScrapFolderDto } from '../scrapfolders/dto/update-scrapfolder.dto';
//import { AddPostDto } from './dto/add-post.dto';

interface RequestWithUser extends Request {
  user: JwtAuthUser;
}

@ApiTags('Subscribers')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('me')
export class SubscriberController {
  constructor(private readonly svc: SubscriberService) {}

  // 1) 최초 가입 직후 자동 호출
  @Post('subscriber')
  @ApiOperation({
    summary: '최초 가입 이후 자동으로 생성되는 subscriber 프로필',
  })
  async initProfile(@Param('userId') userId: string) {
    const profile = await this.svc.initProfile(userId);
    return {
      message: '기본 프로필이 생성되었습니다.',
      data: profile,
    };
  }

  // 2) 프로필 조회
  @Get('profile')
  @ApiOperation({ summary: 'subscriber 프로필 조회' })
  async getProfile(@Req() req: Request & { user: JwtAuthUser }) {
    const profile = await this.svc.getProfile(req.user.userId);
    return {
      message: '프로필을 성공적으로 조회했습니다.',
      data: profile,
    };
  }

  // 3) 프로필 수정
  @Put('profile')
  @ApiOperation({ summary: 'subscriber 프로필 수정' })
  async updateProfile(
    @Req() req: Request & { user: JwtAuthUser },
    @Body() dto: SubscriberDto,
  ) {
    const updated = await this.svc.updateProfile(req.user.userId, dto);
    return {
      message: '프로필이 성공적으로 업데이트되었습니다.',
      data: updated,
    };
  }

  // 4) 내 스크랩 폴더 조회
  @Get('folders')
  @ApiOperation({ summary: '스크랩 폴더 목록 조회' })
  getFolders(@Req() req: Request & { user: JwtAuthUser }) {
    return this.svc.getFolders(req.user.userId);
  }

  // 퍼블리셔 구독하기
  @Post('subscribe/:publisherId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '퍼블리셔 구독하기' })
  async subscribePublisher(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('publisherId') publisherId: string,
  ) {
    // JWT 토큰에서 userId 꺼내기
    const userId = req.user.userId;
    const updatedSub = await this.svc.subscribePublisher(userId, publisherId);
    return {
      message: '구독 완료되었습니다.',
      data: updatedSub,
    };
  }

  // 5) 내가 구독 중인 퍼블리셔 목록 조회
  @Get('subscriptions/publishers')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '구독 중인 퍼블리셔 목록 조회' })
  async getSubscribedPublishers(@Req() req: Request & { user: JwtAuthUser }) {
    const pubs = await this.svc.getSubscribedPublishers(req.user.userId);
    return {
      message: '구독 중인 퍼블리셔 목록을 가져왔습니다.',
      data: pubs,
    };
  }

  // 6) 내 취향 분석 프로필 조회
  @Get('preferenesprofile')
  @ApiOperation({ summary: '취향 분석 프로필 조회' })
  async getPreferenceProfile(@Req() req: Request & { user: JwtAuthUser }) {
    const pref = await this.svc.getPreferenceProfile(req.user.userId);
    return { message: '취향 분석 정보를 가져왔습니다.', data: pref };
  }

  // 7) 좋아요 누른 게시물 조회
  // 8) 스크랩 폴더 생성
  @Post('folders')
  @ApiOperation({ summary: '스크랩 폴더 생성' })
  async createFolder(
    @Req() req: Request & { user: JwtAuthUser },
    @Body() dto: CreateScrapFolderDto,
  ) {
    const folder = await this.svc.createFolder(req.user.userId, dto);
    return { message: '스크랩 폴더가 생성되었습니다.', data: folder };
  }

  // 스크랩 폴더 수정
  @Put('folders/:folderId')
  @ApiOperation({ summary: '폴더 정보(이름/설명/커버) 수정' })
  updateFolder(
    @Req() req: RequestWithUser,
    @Param('folderId') folderId: string,
    @Body() dto: UpdateScrapFolderDto,
  ) {
    return this.svc.updateFolder(req.user.userId, folderId, dto);
  }
}
