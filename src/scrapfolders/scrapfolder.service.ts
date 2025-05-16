// src/scrapfolders/scrapfolder.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ScrapFolder, ScrapFolderDocument } from './scrapfolder.schema';
import { SubscriberService } from '../subscribers/subscriber.service';

@Injectable()
export class ScrapFolderService {
  constructor(
    @InjectModel(ScrapFolder.name, 'scrapfolderConnection')
    private folderModel: Model<ScrapFolderDocument>,
    private readonly subSvc: SubscriberService, // owner 확인
  ) {}

  async getFolders(userId: string): Promise<ScrapFolderDocument[]> {
    const sub = await this.subSvc.getProfile(userId);
    return this.folderModel.find({ owner: sub._id }).exec();
  }

  async createFolder(
    userId: string,
    dto: { name: string; description?: string; coverImage?: string },
  ): Promise<ScrapFolderDocument> {
    const sub = await this.subSvc.getProfile(userId);
    const folder = new this.folderModel({
      owner: sub._id,
      name: dto.name,
      description: dto.description,
      coverImage: dto.coverImage,
    });
    return folder.save();
  }

  async updateFolder(
    userId: string,
    folderId: string,
    dto: { name?: string; description?: string; coverImage?: string },
  ): Promise<ScrapFolderDocument> {
    const sub = await this.subSvc.getProfile(userId);
    const updated = await this.folderModel
      .findOneAndUpdate(
        { _id: new Types.ObjectId(folderId), owner: sub._id },
        { $set: dto },
        { new: true },
      )
      .exec();
    if (!updated) throw new NotFoundException('Folder not found');
    return updated;
  }

  async deleteFolder(userId: string, folderId: string): Promise<void> {
    const sub = await this.subSvc.getProfile(userId);
    const res = await this.folderModel
      .deleteOne({ _id: new Types.ObjectId(folderId), owner: sub._id })
      .exec();
    if (res.deletedCount === 0) {
      throw new NotFoundException('Folder not found or not yours');
    }
  }
}
