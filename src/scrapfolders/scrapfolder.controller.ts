import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ScrapFolderService } from './scrapfolder.service';
import { CreateScrapFolderDto } from './dto/create-scrapfolder.dto';
import { UpdateScrapFolderDto } from './dto/update-scrapfolder.dto';
//import { AddPostDto } from './dto/add-post.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('Scrap Folders')
@ApiBearerAuth('access-token')
@Controller('folders')
@UseGuards(JwtAuthGuard)
export class ScrapFolderController {
  constructor(private readonly service: ScrapFolderService) {}

  @Post()
  @ApiOperation({ summary: '폴더 생성' })
  create(@Req() req: RequestWithUser, @Body() dto: CreateScrapFolderDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '내 폴더 목록 조회' })
  findAll(@Req() req: RequestWithUser) {
    return this.service.findAll(req.user.userId);
  }

  @Patch(':folderId')
  @ApiOperation({ summary: '폴더 정보(이름/설명/커버) 수정' })
  updateFolder(
    @Req() req: RequestWithUser,
    @Param('folderId') folderId: string,
    @Body() dto: UpdateScrapFolderDto,
  ) {
    return this.service.update(req.user.userId, folderId, dto);
  }

  /*@Post(':folderId/posts')
  @ApiOperation({ summary: '폴더에 게시물 추가' })
  addPost(
    @Request() req,
    @Param('folderId') folderId: string,
    @Body() dto: AddPostDto,
  ) {
    return this.service.addPost(req.user.userId, folderId, dto);
  }

  @Get(':folderId/posts')
  @ApiOperation({ summary: '폴더 내 게시물 조회' })
  findPosts(@Request() req, @Param('folderId') folderId: string) {
    return this.service.findPosts(req.user.userId, folderId);
  }*/
}
