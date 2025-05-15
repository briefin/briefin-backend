import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ScrapFolderService } from './scrapfolder.service';
//import { CreateScrapFolderDto } from './dto/create-scrapfolder.dto';
//import { UpdateScrapFolderDto } from './dto/update-scrapfolder.dto';
//import { AddPostDto } from './dto/add-post.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
//import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('Scrap Folders')
@ApiBearerAuth('access-token')
@Controller('folders')
@UseGuards(JwtAuthGuard)
export class ScrapFolderController {
  constructor(private readonly service: ScrapFolderService) {}

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
