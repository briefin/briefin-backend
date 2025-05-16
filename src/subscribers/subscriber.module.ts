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
    // (A) SubscriberService용 커넥션
    MongooseModule.forFeature(
      [
        { name: Subscriber.name, schema: SubscriberSchema },
        { name: Publisher.name, schema: PublisherSchema },
      ],
      'subscriberConnection',
    ),

    // (B) ScrapFolderService용 커넥션
    MongooseModule.forFeature(
      [{ name: ScrapFolder.name, schema: ScrapFolderSchema }],
      'scrapfolderConnection',
    ),

    // (C) PublisherService용 커넥션
    MongooseModule.forFeature(
      [
        { name: Publisher.name, schema: PublisherSchema },
        { name: Subscriber.name, schema: SubscriberSchema },
      ],
      'publisherConnection',
    ),
  ],
  controllers: [SubscriberController],
  providers: [SubscriberService],
  exports: [SubscriberService],
})
export class SubscriberModule {}
