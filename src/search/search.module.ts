// src/search/search.module.ts
import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PublisherModule } from '../publishers/publisher.module';
import { PostModule } from '../posts/post.module';

@Module({
  imports: [
    PublisherModule, // 내부에 PublisherService export 되어 있어야 함
    PostModule, // 내부에 PostService export 되어 있어야 함
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
