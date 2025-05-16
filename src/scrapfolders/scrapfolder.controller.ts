// src/scrapfolders/scrapfolder.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Req,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ScrapFolderService } from './scrapfolder.service';
import { JwtAuthGuard, JwtAuthUser } from '../auth/auth.guard';
import { CreateScrapFolderDto } from './dto/create-scrapfolder.dto';
import { UpdateScrapFolderDto } from './dto/update-scrapfolder.dto';

@ApiTags('ScrapFolders')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('me/folders')
export class ScrapFolderController {
  constructor(private readonly svc: ScrapFolderService) {}

  @Get()
  @ApiOperation({ summary: '내 스크랩 폴더 목록 조회' })
  async getFolders(@Req() req: Request & { user: JwtAuthUser }) {
    const list = await this.svc.getFolders(req.user.userId);
    return { message: '스크랩 폴더 목록입니다.', data: list };
  }

  @Post()
  @ApiOperation({ summary: '스크랩 폴더 생성' })
  async createFolder(
    @Req() req: Request & { user: JwtAuthUser },
    @Body() dto: CreateScrapFolderDto,
  ) {
    const folder = await this.svc.createFolder(req.user.userId, dto);
    return { message: '폴더가 생성되었습니다.', data: folder };
  }

  @Put(':folderId')
  @ApiOperation({ summary: '스크랩 폴더 수정' })
  async updateFolder(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('folderId') folderId: string,
    @Body() dto: UpdateScrapFolderDto,
  ) {
    const updated = await this.svc.updateFolder(req.user.userId, folderId, dto);
    return { message: '폴더가 수정되었습니다.', data: updated };
  }

  @Delete(':folderId')
  @ApiOperation({ summary: '스크랩 폴더 삭제' })
  async deleteFolder(
    @Req() req: Request & { user: JwtAuthUser },
    @Param('folderId') folderId: string,
  ) {
    await this.svc.deleteFolder(req.user.userId, folderId);
    return { message: '폴더가 삭제되었습니다.' };
  }
}
