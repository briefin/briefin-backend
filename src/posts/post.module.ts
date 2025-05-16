import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './services/post.service';
import { PostMagazineController } from './controllers/post-publisher.controller';
import { PostSubscriberController } from './controllers/post-subscriber.controller';
import { Post, PostSchema } from './post.schema';
//import { Magazine, MagazineSchema } from '../magazines/magazine.schema';
import { MagazineModule } from '../magazines/magazine.module';
import { PublisherModule } from '../publishers/publisher.module';
import { PublisherSchema } from 'src/publishers/publisher.schema';
import { Publisher } from 'src/publishers/publisher.schema';
import { Magazine, MagazineSchema } from 'src/magazines/magazine.schema';

@Module({
  imports: [
    // Post 모델 바인딩
    MongooseModule.forFeature(
      [{ name: Post.name, schema: PostSchema }],
      'postConnection',
    ),

    MongooseModule.forFeature(
      [{ name: Publisher.name, schema: PublisherSchema }],
      'publisherConnection',
    ),
    MongooseModule.forFeature(
      [{ name: Magazine.name, schema: MagazineSchema }],
      'magazineConnection',
    ),

    // MagazineService, MagazineModel 등을 사용하기 위해
    // MagazineModule 을 import 합니다.
    MagazineModule,

    // PublisherService 사용을 위해
    PublisherModule,
  ],
  providers: [PostService],
  controllers: [PostMagazineController, PostSubscriberController],
  exports: [PostService],
})
export class PostModule {}
