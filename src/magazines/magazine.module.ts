import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Magazine, MagazineSchema } from './magazine.schema';
import { MagazineService } from './magazine.service';
import { MagazineController } from './magazine.controller';
import { PublisherModule } from '../publishers/publisher.module';
import { User, UserSchema } from '../users/user.schema';
import { Publisher, PublisherSchema } from 'src/publishers/publisher.schema';
@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Magazine.name, schema: MagazineSchema },
        { name: Publisher.name, schema: PublisherSchema },
        { name: User.name, schema: UserSchema },
      ],
      'magazineConnection', // ← AppModule 에서 설정한 connectionName
    ),
    PublisherModule,
  ],
  controllers: [MagazineController],
  providers: [MagazineService],
  exports: [MagazineService],
})
export class MagazineModule {}
