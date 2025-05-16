// src/scrapfolders/scrapfolder.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapFolder, ScrapFolderSchema } from './scrapfolder.schema';
import { ScrapFolderService } from './scrapfolder.service';
import { ScrapFolderController } from './scrapfolder.controller';
import { SubscriberModule } from '../subscribers/subscriber.module';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ScrapFolder.name, schema: ScrapFolderSchema }],
      'scrapfolderConnection',
    ),
    SubscriberModule, // ← SubscriberService를 쓰기 위해 import
  ],
  providers: [ScrapFolderService],
  controllers: [ScrapFolderController],
  exports: [ScrapFolderService],
})
export class ScrapFolderModule {}
