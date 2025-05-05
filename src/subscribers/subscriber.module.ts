import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscriber, SubscriberSchema } from './subscriber.schema';
/*import {
  ScrapFolder,
  ScrapFolderSchema,
} from '../scrapfolders/scrapfolder.schema';*/
import { SubscriberService } from './subscriber.service';
import { SubscriberController } from './subscriber.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Subscriber.name, schema: SubscriberSchema }],
      'subscriberConnection', // ← AppModule 에서 만든 connectionName 과 동일해야 합니다.
    ),
  ],
  providers: [SubscriberService],
  controllers: [SubscriberController],
  exports: [SubscriberService], // 다른 모듈에서 쓰려면 export
})
export class SubscriberModule {}
