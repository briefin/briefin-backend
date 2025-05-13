import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostService } from './services/post.service';
import { PostController } from './controllers/post.controller';
import { Post, PostSchema } from './post.schema';
import { Magazine, MagazineSchema } from '../magazines/magazine.schema';

@Module({
  imports: [
    // Post 모델
    MongooseModule.forFeature(
      [{ name: Post.name, schema: PostSchema }],
      'magazineConnection',
    ),
    // Magazine 모델 (populate 용)
    MongooseModule.forFeature(
      [{ name: Magazine.name, schema: MagazineSchema }],
      'magazineConnection',
    ),
    // 만약 Publisher 모델도 별도 DB 연결이라면 같은 방식으로 import
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
