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
import { Publisher, PublisherSchema } from '../publishers/publisher.schema';

@Module({
  imports: [
    // 1) Subscriber 스키마 (subscriberConnection)
    MongooseModule.forFeature(
      [
        { name: Subscriber.name, schema: SubscriberSchema },
        // 여기에 Publisher도 같이 등록
        { name: Publisher.name, schema: PublisherSchema },
      ],
      'subscriberConnection',
    ),
    // 2) ScrapFolder 스키마 (scrapfolderConnection)
    MongooseModule.forFeature(
      [{ name: ScrapFolder.name, schema: ScrapFolderSchema }],
      'scrapfolderConnection',
    ),
    // 3) Publisher 스키마 (scrapfolderConnection)
    MongooseModule.forFeature(
      [{ name: Publisher.name, schema: PublisherSchema }],
      'publisherConnection',
    ),
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService],
  exports: [SubscriberService], // 다른 모듈에서 쓰려면 export
})
export class SubscriberModule {}
