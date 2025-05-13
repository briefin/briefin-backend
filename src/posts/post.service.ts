import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Magazine, MagazineDocument } from '../magazines/magazine.schema';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name, 'magazineConnection')
    private readonly postModel: Model<PostDocument>,
    @InjectModel(Magazine.name, 'magazineConnection')
    private readonly magazineModel: Model<MagazineDocument>,
  ) {}

  async create(
    magazineId: string,
    authorId: string,
    dto: CreatePostDto,
  ): Promise<PostDocument> {
    // 1) 매거진 존재 및 권한 검사
    const mag = await this.magazineModel.findById(magazineId);
    if (!mag) throw new NotFoundException('존재하지 않는 매거진입니다.');
    /*if (String(mag.publisher) !== authorId)
      throw new ForbiddenException('퍼블리셔 권한이 없습니다.');*/

    // 2) 생성
    const created = new this.postModel({
      ...dto,
      author: new Types.ObjectId(authorId),
      magazine: new Types.ObjectId(magazineId),
    });
    return created.save();
  }

  async findAllInMagazine(magazineId: string) {
    return this.postModel
      .find({ magazine: magazineId })
      .populate('author', 'name') // 필요 필드만
      .exec();
  }

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
    authorId: string,
    dto: UpdatePostDto,
  ) {
    const post = await this.postModel.findOne({
      _id: postId,
      magazine: magazineId,
    });
    if (!post) throw new NotFoundException('포스트를 찾을 수 없습니다.');
    if (post.author.toString() !== authorId)
      throw new ForbiddenException('수정 권한이 없습니다.');

    Object.assign(post, dto);
    return post.save();
  }

  async remove(magazineId: string, postId: string, authorId: string) {
    const post = await this.postModel.findOne({
      _id: postId,
      magazine: magazineId,
    });
    if (!post) throw new NotFoundException('포스트를 찾을 수 없습니다.');
    if (post.author.toString() !== authorId)
      throw new ForbiddenException('삭제 권한이 없습니다.');

    return this.postModel.deleteOne({ _id: postId }).exec();
  }
}
