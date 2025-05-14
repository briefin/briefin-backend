// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { SubscriberModule } from './subscribers/subscriber.module';
import { ScrapFolderModule } from './scrapfolders/scrapfolder.module';
import { UserModule } from './users/user.module';
import { MagazineModule } from './magazines/magazine.module';
import { PostModule } from './posts/post.module';
import { PublisherModule } from './publishers/publisher.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }), // .env

    // 1. User DB 연결
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_USER'), // 클러스터 URI
        dbName: 'User', // DB 이름만 따로 줄 수도 있음
      }),
      connectionName: 'userConnection',
    }),

    // 2. Subscriber DB 연결
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_SUBSCRIBER'), // 클러스터 URI
        dbName: 'Subscriber', // DB 이름만 따로 줄 수도 있음
      }),
      connectionName: 'subscriberConnection',
    }),

    // 3. Scrapfolder DB 연결
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_SCRAPFOLDER'), // 클러스터 URI
        dbName: 'Scrapfolder', // DB 이름만 따로 줄 수도 있음
      }),
      connectionName: 'scrapfolderConnection',
    }),

    // 4. Magazine DB 연결 추가
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      connectionName: 'magazineConnection',
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_MAGAZINE'),
        dbName: 'Magazine',
      }),
    }),

    // 5. Post DB 연결 추가
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      connectionName: 'postConnection',
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_POST'),
        dbName: 'Post',
      }),
    }),

    // 6. Publisher DB 연결
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_PUBLISHER'), // 클러스터 URI
        dbName: 'Publisher', // DB 이름만 따로 줄 수도 있음
      }),
      connectionName: 'publisherConnection',
    }),

    AuthModule,
    SubscriberModule,
    ScrapFolderModule,
    MagazineModule,
    PostModule,
    UserModule,
    PublisherModule,
  ],
})
export class AppModule {}
