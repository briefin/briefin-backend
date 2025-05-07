import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  // 1) 글로벌 ValidationPipe 등록
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 프로퍼티 자동 제거
      transform: true, // 요청 바디를 DTO 클래스로 자동 변환
    }),
  );

  // 2) src/assets 폴더를 /static 경로로 노출
  app.use('/static', express.static(join(__dirname, '..', 'src/assets')));

  await app.listen(4000, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('앱 시작 중 오류 발생:', err);
});
