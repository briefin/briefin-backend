import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from './publisher.schema';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Publisher.name, schema: PublisherSchema }],
      'publisherConnection'
    ),
  ],
  providers: [PublisherService],
  controllers: [PublisherController],
  exports: [PublisherService],
})
export class PublisherModule {}
