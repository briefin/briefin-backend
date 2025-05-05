import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import * as express from 'express';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);

  // src/assets 폴더를 /static 경로로 노출
  app.use('/static', express.static(join(__dirname, '..', 'src/assets')));

  await app.listen(4000);
}

bootstrap().catch((err) => {
  console.error('앱 시작 중 오류 발생:', err);
});
