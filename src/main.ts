import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  // ── 전역 CORS 설정 ──────────────────────────────────────
  app.enableCors({
    origin: 'http://172.23.96.1:3000', // 허용할 프론트엔드 주소
    credentials: true, // 쿠키 인증을 쓴다면 true
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
  });

  // 1) 글로벌 ValidationPipe 등록
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 프로퍼티 자동 제거
      transform: true, // 요청 바디를 DTO 클래스로 자동 변환
    }),
  );

  // 2) src/assets 폴더를 /static 경로로 노출
  app.use('/static', express.static(join(__dirname, '..', 'src/assets')));

  // 3) uploads 폴더를 /uploads 경로로 노출
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(4000, '0.0.0.0');
  console.log('🚀 Server running on http://0.0.0.0:4000');
}

bootstrap().catch((err) => {
  console.error('앱 시작 중 오류 발생:', err);
});
