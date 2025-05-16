// src/publishers/publishers.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from './publisher.schema';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { MePublisherController } from './me.publisher.controller';
import { User, UserSchema } from 'src/users/user.schema';

// Subscriber, Magazine 스키마 import
import {
  Subscriber,
  SubscriberSchema,
} from 'src/subscribers/subscriber.schema';
import { Magazine, MagazineSchema } from 'src/magazines/magazine.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Publisher.name, schema: PublisherSchema },
        { name: User.name, schema: UserSchema },
        { name: Subscriber.name, schema: SubscriberSchema }, // ← 추가
        { name: Magazine.name, schema: MagazineSchema }, // ← 추가
      ],
      'publisherConnection',
    ),
  ],
  providers: [PublisherService],
  controllers: [PublisherController, MePublisherController],
  exports: [PublisherService],
})
export class PublisherModule {}
