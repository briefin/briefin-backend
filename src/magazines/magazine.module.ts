import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Magazine, MagazineSchema } from './magazine.schema';
import { MagazineService } from './magazine.service';
import { MagazineController } from './magazine.controller';
import { PublisherModule } from '../publishers/publisher.module';
import { Publisher, PublisherSchema } from 'src/publishers/publisher.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Magazine.name, schema: MagazineSchema }],
      'magazineConnection', // ← AppModule 에서 설정한 connectionName
    ),
    MongooseModule.forFeature(
      [{ name: Publisher.name, schema: PublisherSchema }],
      'publisherConnection',
    ),
    PublisherModule,
  ],
  controllers: [MagazineController],
  providers: [MagazineService],
  exports: [MagazineService],
})
export class MagazineModule {}
