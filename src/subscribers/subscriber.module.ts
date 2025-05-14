import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from './subscriber.schema';
/*import {
  ScrapFolder,
  ScrapFolderSchema,
} from '../scrapfolders/scrapfolder.schema';*/
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';
import {
  ScrapFolder,
  ScrapFolderSchema,
} from '../scrapfolders/scrapfolder.schema';

@Module({
  imports: [
    // 1) Subscriber 스키마 (subscriberConnection)
    MongooseModule.forFeature(
      [{ name: Subscriber.name, schema: SubscriberSchema }],
      'subscriberConnection',
    ),
    // 2) ScrapFolder 스키마 (scrapfolderConnection)
    MongooseModule.forFeature(
      [{ name: ScrapFolder.name, schema: ScrapFolderSchema }],
      'scrapfolderConnection',
    ),
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService],
  exports: [SubscriberService], // 다른 모듈에서 쓰려면 export
})
export class SubscriberModule {}
