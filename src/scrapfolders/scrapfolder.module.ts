// src/scrapfolder/scrapfolder.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapFolderController } from './scrapfolder.controller';
import { ScrapFolderService } from './scrapfolder.service';
import { ScrapFolder, ScrapFolderSchema } from './scrapfolder.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: ScrapFolder.name, schema: ScrapFolderSchema }],
      'scrapfolderConnection', // ← AppModule 에서 만든 connectionName 과 동일해야 합니다.
    ),
  ],
  controllers: [ScrapFolderController],
  providers: [ScrapFolderService],
  exports: [ScrapFolderService], // 다른 모듈에서 사용하기 위해 export
})
export class ScrapFolderModule {}
