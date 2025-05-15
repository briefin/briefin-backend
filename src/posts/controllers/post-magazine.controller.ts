import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { RequestWithUser } from '../../common/interfaces/request-with-user.interface';
import { PostService } from '../services/post.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PublisherService } from 'src/publishers/publisher.service'
import { MagazineService } from 'src/magazines/magazine.service';



  
@ApiBearerAuth('access-token')
@ApiTags('Post-Magazine')
//@UseGuards(JwtAuthGuard) 필요하면 밑에 넣기기
@Controller('magazines/:magazineId')
export class PostMagazineController {
    constructor(
        private readonly postService: PostService,
        private readonly publisherService : PublisherService,
        private readonly magazineService: MagazineService,
    ) {}
    @Post('posts')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '매거진 내부에 포스트 생성 (퍼블리셔)' })
    async create(
        @Req() req: RequestWithUser,
        @Param('magazineId') magazineId: string,
        @Body() dto: CreatePostDto,
    ) {
        // userId로 publisher 조회
        const publisher = await this.publisherService.getByUserId(req.user.userId);
        const publisherId = publisher[0]._id;
        if (!publisherId) throw new NotFoundException('퍼블리셔를 찾을 수 없습니다.');
        return this.postService.create(magazineId, publisherId.toString(), dto);
    }
    /*
    @Get('posts')
    @ApiOperation({ summary: '매거진 내부 포스트 목록 조회' })
    async findAll(
        @Param('magazineId') magazineId: string
    ) {
        return this.postService.findAllInMagazine(magazineId);
    }*/ // publisher 정보 불러오는 것 때문에 잠시 보류류

 
    @Get('posts/:postId')
    @ApiOperation({ summary: '매거진 내부 포스트 상세 조회' })
    async findOne(
        @Param('magazineId') magazineId: string,
        @Param('postId') postId: string,
    ) {
        const post = await this.postService.findOne(magazineId, postId);
        if (!post) throw new NotFoundException('포스트를 찾을 수 없습니다.');
        return post;
    }
    
  
    @Patch('posts/:postId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '매거진 내부 포스트 수정 (퍼블리셔)' })
    async update(
      @Req() req: RequestWithUser,
      @Param('magazineId') magazineId: string,
      @Param('postId') postId: string,
      @Body() updatePostDto: UpdatePostDto,
    ) {
        const publisher = await this.publisherService.getByUserId(req.user.userId);
        const publisherId = publisher[0]?._id;

        const magazine = await this.magazineService.findOne(magazineId);
        if (!magazine) throw new NotFoundException('매거진을 찾을 수 없습니다.');
        if(magazine.publisher._id.toString() != publisherId) {
            throw new NotFoundException('수정 권한이 없습니다.');
        }

        return this.postService.update(
        magazineId,
        postId,
        magazine.publisher._id.toString(),
        updatePostDto,
      );
    }
  
    @Delete('posts/:postId')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '매거진 내부 포스트 삭제 (퍼블리셔)' })
    async remove(
      @Req() req: RequestWithUser,
      @Param('magazineId') magazineId: string,
      @Param('postId') postId: string,
    ) {
        const publisher = await this.publisherService.getByUserId(req.user.userId);
        const publisherId = publisher[0]?._id;

         const magazine = await this.magazineService.findOne(magazineId);
        if (!magazine) throw new NotFoundException('매거진을 찾을 수 없습니다.');
        if(magazine.publisher._id.toString() != publisherId) {
            throw new NotFoundException('삭제 권한이 없습니다.');
        }

        return this.postService.remove(magazineId, postId, magazine.publisher._id.toString());
        
      } 
}
