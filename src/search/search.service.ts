// src/search/search.service.ts
import { Injectable } from '@nestjs/common';
import { PublisherService } from '../publishers/publisher.service';
import { PostService } from '../posts/services/post.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly publisherService: PublisherService,
    private readonly postService: PostService,
  ) {}

  /** 퍼블리셔 검색 */
  searchPublishers(q: string) {
    return this.publisherService.searchPublishers(q);
  }

  /** 포스트 검색 (제목·내용 등) */
  searchPosts(q: string) {
    return this.postService.searchPosts(q);
  }
}
