import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateScrapFolderDto } from './dto/create-scrapfolder.dto';
import { UpdateScrapFolderDto } from './dto/update-scrapfolder.dto';
//import { AddPostDto } from './dto/add-post.dto';
import { ScrapFolder, ScrapFolderDocument } from './scrapfolder.schema';

@Injectable()
export class ScrapFolderService {
  constructor(
    @InjectModel(ScrapFolder.name, 'scrapfolderConnection')
    private scrapFolderModel: Model<ScrapFolderDocument>,
  ) {}

  /**
   * 사용자가 새로운 스크랩 폴더를 생성합니다.
   * @param userId - 요청을 보낸 사용자의 ID
   * @param dto - 폴더 이름(name)과 설명(description)을 담은 DTO
   * @returns 생성된 ScrapFolder 문서
   */
  async create(
    userId: string,
    dto: CreateScrapFolderDto,
  ): Promise<ScrapFolder> {
    const folder = new this.scrapFolderModel({
      owner: new Types.ObjectId(userId), // string → ObjectId 변환
      name: dto.name,
      description: dto.description,
    });
    return folder.save(); // MongoDB에 저장하고 결과 반환
  }

  /** 내 폴더 목록 조회 */
  async findAll(userId: string): Promise<ScrapFolder[]> {
    console.log('▶ findAll owner filter (string):', userId);
    const ownerOid = new Types.ObjectId(userId);
    console.log('▶ findAll owner filter (ObjectId):', ownerOid);
    const docs = await this.scrapFolderModel
      .find({ owner: ownerOid })
      .lean()
      .exec();
    console.log('▶ findAll result:', docs);
    return docs;
  }

  /** 폴더 업데이트 */
  async update(
    userId: string,
    folderId: string,
    dto: UpdateScrapFolderDto,
  ): Promise<ScrapFolder> {
    // 문자열 → ObjectId 변환
    const ownerOid = new Types.ObjectId(userId);
    const folderOid = new Types.ObjectId(folderId);

    const folder = await this.scrapFolderModel.findOneAndUpdate(
      { _id: folderOid, owner: ownerOid }, // both ObjectId 사용
      { $set: dto },
      { new: true },
    );

    if (!folder) throw new NotFoundException('Folder not found');
    return folder;
  }

  /**
   * 특정 폴더에 게시물(postId)을 추가합니다.
   * - 폴더가 존재하는지, 해당 사용자의 소유인지 검증
   * - 중복된 게시물 ID는 한 번만 추가
   * @param userId - 요청을 보낸 사용자의 ID
   * @param folderId - 게시물을 추가할 폴더의 ID
   * @param dto - 추가할 게시물 ID를 담은 DTO
   * @throws NotFoundException 폴더가 없거나 소유자가 다를 때
   * @returns 업데이트된 ScrapFolder 문서
   */
  /*async addPost(
    userId: string,
    folderId: string,
    dto: AddPostDto,
  ): Promise<ScrapFolder> {
    const folder = await this.scrapFolderModel.findOne({
      _id: folderId,
      user: userId,
    });
    if (!folder) throw new NotFoundException('Folder not found');

    const postOid = new Types.ObjectId(dto.postId);
    // 이미 추가된 게시물이 아니면 배열에 push
    if (!folder.posts.includes(postOid)) {
      folder.posts.push(postOid);
      await folder.save();
    }
    return folder;
  }*/

  /**
   * 특정 폴더에 저장된 게시물 ID 목록을 반환합니다.
   * @param userId - 요청을 보낸 사용자의 ID
   * @param folderId - 조회할 폴더의 ID
   * @throws NotFoundException 폴더가 없거나 소유자가 다를 때
   * @returns 게시물 ObjectId 배열
   */
  /*async findPosts(userId: string, folderId: string): Promise<Types.ObjectId[]> {
    const folder = await this.scrapFolderModel.findOne({
      _id: folderId,
      user: userId,
    });
    if (!folder) throw new NotFoundException('Folder not found');
    return folder.posts;
  }*/
}
