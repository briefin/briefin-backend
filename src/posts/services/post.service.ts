import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
//import { Model } from 'mongoose';
import { Post, PostDocument } from '../post.schema';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
//import { Magazine, MagazineDocument } from '../../magazines/magazine.schema';
import { MagazineService } from '../../magazines/magazine.service';
import { PublisherService } from 'src/publishers/publisher.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name, 'magazineConnection')
    private readonly postModel: Model<PostDocument>,
    private readonly magazineService: MagazineService,
    private readonly publisherService: PublisherService,
  ) {}

  async create(
    magazineId: string,
    publisherId: string,
    dto: CreatePostDto,
  ): Promise<Post> {
    // 1) 매거진 존재 및 권한 검사
    const magazine = await this.magazineService.findOne(magazineId);
    if (!magazine) throw new NotFoundException('매거진을 찾을 수 없습니다.');

    if (magazine.publisher.toString() !== publisherId)
      throw new ForbiddenException('포스트 생성 권한이 없습니다.');

    // 2) 생성
    const post = new this.postModel({
      ...dto,
      publisher: publisherId,
      isPublished: false,
      magazine: magazineId,
      viewCount: 0,
    });
    return post.save();
  }

  /*async findAllInMagazine(magazineId: string) {

     // 1) 매거진 조회해서 퍼블리셔 닉네임 꺼내기
     const magazine = await this.magazineService.findOne(magazineId);
     const publisherName = magazine.publisher.nickname;

    // 2) lean()으로 순수 JS 객체 추출
    const posts = await this.postModel
    .find({ magazine: magazineId })
    .lean()
    .exec();

    // 2) 고유한 author ID들 뽑기
    const authorIds = Array.from(new Set(posts.map(p => p.author)));

    // 3) 각 author ID에 대한 이름 조회
    const authors = await this.publisherService.findByIds(authorIds);

    // 4) 각 포스트에 author 정보 추가
    const postsWithAuthors = posts.map(p => {
      

   
  }*/

  async findOne(magazineId: string, postId: string) {
    const post = await this.postModel
      .findOne({ _id: postId, magazine: magazineId })
      .populate('author', 'name')
      .exec();
    if (!post) throw new NotFoundException('포스트를 찾을 수 없습니다.');
    return post;
  }

  async update(
    magazineId: string,
    postId: string,
    publisherId: string,
    dto: UpdatePostDto,
  ): Promise<Post> {
    const post = await this.postModel
      .findOne({
        _id: postId,
        magazine: magazineId,
      })
      .exec();

    if (!post) throw new NotFoundException('포스트를 찾을 수 없습니다.');
    if (post.publisher.toString() !== publisherId)
      throw new ForbiddenException('수정 권한이 없습니다.');

    Object.assign(post, dto);
    return post.save();
  }

  async remove(magazineId: string, postId: string, publisherId: string) {
    const post = await this.postModel.findOne({
      _id: postId,
      magazine: magazineId,
    });
    if (!post) throw new NotFoundException('포스트를 찾을 수 없습니다.');

    if (post.publisher.toString() !== publisherId)
      throw new ForbiddenException('삭제 권한이 없습니다.');

    return this.postModel.deleteOne({ _id: postId }).exec();
  }

  /**
   * 키워드 q 가 제목(title) 또는 본문(content)에 포함된 포스트 검색
   * q가 유효한 ObjectId 이면 _id 매칭도 수행
   */
  async searchPosts(q: string): Promise<PostDocument[]> {
    return this.postModel
      .aggregate<PostDocument>([
        {
          $search: {
            index: 'postIndex', // Atlas UI에서 생성한 인덱스 이름
            text: {
              query: q,
              path: ['title', 'content'],
              fuzzy: { maxEdits: 1, prefixLength: 2 },
            },
          },
        },
        { $limit: 20 },
        {
          $project: {
            title: 1,
            content: 1,
            magazine: 1,
            publisher: 1,
            viewCount: 1,
            createdAt: 1,
            // 검색 점수(meta)도 필요하면
            score: { $meta: 'searchScore' },
          },
        },
      ])
      .exec();
  }
}
