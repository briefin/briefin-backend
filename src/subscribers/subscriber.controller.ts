// src/subscriber/subscriber.controller.ts
import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { SubscriberService } from './subscriber.service';
import { SubscriberDto } from './dto/subscriber.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
//import { CreateScrapFolderDto } from './dto/create-scrap-folder.dto';
//import { AddPostDto } from './dto/add-post.dto';

@ApiTags('Subscribers')
@Controller('subscribers')
export class SubscriberController {
  constructor(private readonly svc: SubscriberService) {}

  // 1) 최초 가입 직후 자동 호출
  @Post(':userId/profile/init')
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
  @Get(':userId/profile')
  @ApiOperation({ summary: 'subscriber 프로필 조회' })
  async getProfile(@Param('userId') userId: string) {
    const profile = await this.svc.getProfile(userId);
    return {
      message: '프로필을 성공적으로 조회했습니다.',
      data: profile,
    };
  }

  // 3) 프로필 수정
  @Put(':userId/profile')
  @ApiOperation({ summary: 'subscriber 프로필 수정' })
  async updateProfile(
    @Param('userId') userId: string,
    @Body() dto: SubscriberDto,
  ) {
    const updated = await this.svc.updateProfile(userId, dto);
    return {
      message: '프로필이 성공적으로 업데이트되었습니다.',
      data: updated,
    };
  }

  // 4) 퍼블리셔 구독
  /*@Post(':userId/subscribe/:publisherId')
  subscribePublisher(
    @Param('userId') userId: string,
    @Param('publisherId') publisherId: string,
  ) {
    return this.svc.subscribePublisher(userId, publisherId);
  }

  // 5) 게시물 좋아요
  @Post(':userId/like/:postId')
  likePost(@Param('userId') userId: string, @Param('postId') postId: string) {
    return this.svc.likePost(userId, postId);
  }

  // 6) 스크랩 폴더 생성
  @Post(':userId/folders')
  createFolder(@Param('userId') userId: string, @Body() dto: ScrapFolderDto) {
    return this.svc.createFolder(userId, dto);
  }

  // 7) 스크랩 폴더 조회
  @Get(':userId/folders')
  getFolders(@Param('userId') userId: string) {
    return this.svc.getFolders(userId);
  }

  // 8) 스크랩 폴더에 게시물 추가
  @Post('folders/:folderId/posts')
  addPostToFolder(
    @Param('folderId') folderId: string,
    @Body() dto: AddPostDto,
  ) {
    return this.svc.addPostToFolder(folderId, dto.postId);
  }*/
}
