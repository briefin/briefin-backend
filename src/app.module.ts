// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
//import { UserModule } from './users/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // .env

    // ⭐ 반드시 connectionName 을 **최상위**에 둡니다
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        uri: cs.get<string>('MONGO_URI_USER'), // 클러스터 URI
        dbName: 'User', // DB 이름만 따로 줄 수도 있음
      }),
      connectionName: 'userConnection', // ← 여기!
    }),

    AuthModule,
    //UserModule,
  ],
})
export class AppModule {}
