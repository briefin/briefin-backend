import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@ApiTags('Posts')
@Controller('magazines/:magazineId/posts')
export class PostSubscriberController {
  constructor(private readonly postService: PostService) {}
  /*
  @Post()
  @ApiOperation({ summary: '매거진 내부에 포스트 생성' })
  create(
    @Req() req: RequestWithUser,
    @Param('magazineId') magazineId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.create(magazineId, req.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '매거진 내부 포스트 목록 조회' })
  findAll(@Param('magazineId') magazineId: string) {
    return this.postService.findAllInMagazine(magazineId);
  }

  @Get(':postId')
  @ApiOperation({ summary: '매거진 내부 포스트 상세 조회' })
  findOne(
    @Param('magazineId') magazineId: string,
    @Param('postId') postId: string,
  ) {
    return this.postService.findOne(magazineId, postId);
  }

  @Patch(':postId')
  @ApiOperation({ summary: '매거진 내부 포스트 수정' })
  update(
    @Req() req: RequestWithUser,
    @Param('magazineId') magazineId: string,
    @Param('postId') postId: string,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.update(magazineId, postId, req.user.userId, dto);
  }

  @Delete(':postId')
  @ApiOperation({ summary: '매거진 내부 포스트 삭제' })
  remove(
    @Req() req: RequestWithUser,
    @Param('magazineId') magazineId: string,
    @Param('postId') postId: string,
  ) {
    return this.postService.remove(magazineId, postId, req.user.userId);
  }
    */
}
