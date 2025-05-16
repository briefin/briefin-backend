// src/search/search.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SearchService } from './search.service';

@ApiTags('Search')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * 개별 검색:
   * GET /search/publishers?q=키워드
   * GET /search/posts?q=키워드
   */
  @Get(':entity')
  @ApiOperation({ summary: 'entity(publishers|posts)별 검색' })
  async searchEntity(
    @Param('entity') entity: 'publishers' | 'posts',
    @Query('q') q: string,
  ) {
    if (!q?.trim()) return [];

    if (entity === 'publishers') {
      return this.searchService.searchPublishers(q.trim());
    } else if (entity === 'posts') {
      return this.searchService.searchPosts(q.trim());
    } else {
      throw new BadRequestException(
        '검색 가능한 entity는 publishers | posts 입니다',
      );
    }
  }

  /**
   * 통합 검색 (타입 미지정 시)
   * GET /search?q=키워드
   */
  @Get()
  @ApiOperation({ summary: '통합 검색 (publishers+posts)' })
  async globalSearch(@Query('q') q: string) {
    if (!q?.trim()) return { publishers: [], posts: [] };

    const [publishers, posts] = await Promise.all([
      this.searchService.searchPublishers(q.trim()),
      this.searchService.searchPosts(q.trim()),
    ]);
    return { publishers, posts };
  }
}
