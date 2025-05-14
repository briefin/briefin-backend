import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Publisher, PublisherSchema } from './publisher.schema';
import { PublisherService } from './publisher.service';
import { PublisherController } from './publisher.controller';
import { User, UserSchema } from 'src/users/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Publisher.name, schema: PublisherSchema },
        { name: User.name, schema: UserSchema },
      ],
      'publisherConnection',
    ),
  ],
  providers: [PublisherService],
  controllers: [PublisherController],
  exports: [PublisherService],
})
export class PublisherModule {}
