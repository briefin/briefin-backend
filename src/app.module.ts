import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { SubscriberModule } from './subscribers/subscriber.module';
import { ScrapFolderModule } from './scrapfolders/scrapfolder.module';
import { UserModule } from './users/user.module';
import { MagazineModule } from './magazines/magazine.module';
import { PostModule } from './posts/post.module';
import { PublisherModule } from './publishers/publisher.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ 이거 꼭 있어야 함
      envFilePath: '.env',
    }),
    // Global environment configuration
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (
          _req,
          file: Express.Multer.File, // ← 타입을 명시
          callback: (err: Error | null, name: string) => void,
        ) => {
          // 이제 file.originalname 은 string 으로 인식됩니다
          const uniqueSuffix = Date.now() + extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}`);
        },
      }),
    }),

    // 1. User DB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_USER'),
        dbName: 'User',
      }),
      connectionName: 'userConnection',
    }),

    // 2. Subscriber DB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_SUBSCRIBER'),
        dbName: 'Subscriber',
      }),
      connectionName: 'subscriberConnection',
    }),

    // 3. Scrapfolder DB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_SCRAPFOLDER'),
        dbName: 'Scrapfolder',
      }),
      connectionName: 'scrapfolderConnection',
    }),

    // 4. Magazine DB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_MAGAZINE'),
        dbName: 'Magazine',
      }),
      connectionName: 'magazineConnection',
    }),

    // 5. Post DB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_POST'),
        dbName: 'Post',
      }),
      connectionName: 'postConnection',
    }),

    // 6. Publisher DB connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_PUBLISHER'),
        dbName: 'Publisher',
      }),
      connectionName: 'publisherConnection',
    }),

    // Application modules
    AuthModule,
    SubscriberModule,
    ScrapFolderModule,
    MagazineModule,
    PostModule,
    UserModule,
    PublisherModule,
    SearchModule,
  ],
})
export class AppModule {}
