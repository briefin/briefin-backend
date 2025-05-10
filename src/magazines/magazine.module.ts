import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Magazine, MagazineSchema } from './magazine.schema';
import { MagazineService } from './magazine.service';
import { MagazineController } from './magazine.controller';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: Magazine.name, schema: MagazineSchema }],
      'magazineConnection', // ← AppModule 에서 설정한 connectionName
    ),
  ],
  controllers: [MagazineController],
  providers: [MagazineService],
  exports: [MagazineService],
})
export class MagazineModule {}
