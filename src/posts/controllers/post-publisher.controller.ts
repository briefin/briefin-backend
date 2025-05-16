// src/posts/controllers/post.controller.ts
import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PostService } from '../services/post.service';
import { PublisherService } from 'src/publishers/publisher.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { multerOptions } from 'src/common/multer.options';
import { CreatePostBodyDto } from '../dto/create-post-body.dto';

@ApiTags('Posts')
@ApiBearerAuth('access-token')
@Controller('publishers/:publisherId/posts')
@UseGuards(JwtAuthGuard) // 읽기 전용 API 제외하고 모두 보호
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly publisherService: PublisherService,
  ) {}

  /* ------------------------------------------------------------------
     1. 포스트 생성
  ------------------------------------------------------------------ */
  @Post()
  @ApiOperation({ summary: '퍼블리셔가 포스트 생성' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  @ApiBody({
    description: '이미지 파일 최대 10개 + 포스트 데이터',
    required: true,
    schema: {
      type: 'object',
      properties: {
        images: {
          // ✅ 필드명 변경
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
        title: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  async create(
    @Req() req: RequestWithUser,
    @Param('publisherId') publisherId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreatePostBodyDto, // ✅ 본문 전용 DTO
  ) {
    await this.ensureOwnership(req.user.userId, publisherId);

    if (!files?.length) {
      throw new BadRequestException('이미지 파일이 최소 1개 필요합니다.');
    }

    const input: CreatePostDto = {
      ...body,
      images: files.map((f) => f.filename),
    };

    return this.postService.create(publisherId, input);
  }

  /* ------------------------------------------------------------------
     2. 포스트 단건 조회  (인증 불필요 → JwtAuthGuard 해제)
  ------------------------------------------------------------------ */
  @Get(':postId')
  @UseGuards() // 보호 해제
  @ApiOperation({ summary: '포스트 상세 조회' })
  async findOne(@Param('postId') postId: string) {
    const post = await this.postService.findOne(postId);
    if (!post) throw new NotFoundException('포스트를 찾을 수 없습니다.');
    return post;
  }

  /* ------------------------------------------------------------------
     3. 포스트 수정
  ------------------------------------------------------------------ */
  @Patch(':postId')
  @ApiOperation({ summary: '포스트 수정(퍼블리셔)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10, multerOptions))
  async update(
    @Req() req: RequestWithUser,
    @Param('publisherId') publisherId: string,
    @Param('postId') postId: string,
    @UploadedFiles() images: Express.Multer.File[],
    @Body() dto: UpdatePostDto,
  ) {
    await this.ensureOwnership(req.user.userId, publisherId);

    const contents = images?.length
      ? images.map((f, i) => ({ url: f.filename, order: i }))
      : undefined; // 이미지가 없으면 그대로 유지

    return this.postService.update(postId, publisherId, { ...dto, contents });
  }

  /* ------------------------------------------------------------------
     4. 포스트 삭제
  ------------------------------------------------------------------ */
  @Delete(':postId')
  @ApiOperation({ summary: '포스트 삭제(퍼블리셔)' })
  async remove(
    @Req() req: RequestWithUser,
    @Param('publisherId') publisherId: string,
    @Param('postId') postId: string,
  ) {
    await this.ensureOwnership(req.user.userId, publisherId);
    return this.postService.remove(postId, publisherId);
  }

  /* ------------------------------------------------------------------
     ▶︎ 공통: 로그인 사용자 ≠ 퍼블리셔 소유주면 404
  ------------------------------------------------------------------ */
  private async ensureOwnership(userId: string, publisherId: string) {
    const isMine = await this.publisherService.isOwner(userId, publisherId);
    if (!isMine) throw new NotFoundException('퍼블리셔를 찾을 수 없습니다.');
  }
}
