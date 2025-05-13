// src/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('BRIEFIN API 명세')
    .setDescription('briefin api 명세서입니다.')
    .setVersion('1.0')

    // 1) Bearer JWT 추가
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          '발급받은 JWT를 입력하세요.\n예: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      'access-token', // 이 name을 컨트롤러 @ApiBearerAuth 에서도 사용
    )

    // 2) 기존 Kakao OAuth2
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
            tokenUrl: 'https://kauth.kakao.com/oauth/token',
            scopes: {},
          },
        },
      },
      'kakao-oauth2',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:4000/auth/kakao/callback',
      oauth: {
        clientId: process.env.KAKAO_CLIENT_ID!,
        usePkceWithAuthorizationCodeGrant: false,
      },
    },
  });
}
