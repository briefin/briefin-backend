import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { Post, PostSchema } from './post.schema';
//import { Magazine, MagazineSchema } from '../magazines/magazine.schema';
import { MagazineModule } from '../magazines/magazine.module';
import { PublisherModule } from '../publishers/publisher.module';

@Module({
  imports: [
    // Post 모델 바인딩
    MongooseModule.forFeature(
      [{ name: Post.name, schema: PostSchema }],
      'magazineConnection',
    ),

    // MagazineService, MagazineModel 등을 사용하기 위해
    // MagazineModule 을 import 합니다.
    MagazineModule,

    // PublisherService 사용을 위해
    PublisherModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
