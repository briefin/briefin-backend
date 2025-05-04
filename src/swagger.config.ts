// src/swagger.config.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('BRIEFIN API 명세')
    .setDescription('briefin api 명세서입니다.')
    .setVersion('1.0')
    // OAuth2 Authorization Code 플로우 설정
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://kauth.kakao.com/oauth/authorize',
            tokenUrl: 'https://kauth.kakao.com/oauth/token',
            scopes: {}, // 카카오는 scope 파라미터 없이 동작하므로 빈 객체
          },
        },
      },
      'kakao-oauth2', // SecurityScheme 이름
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      oauth2RedirectUrl: 'http://localhost:4000/auth/kakao/callback', // Swagger UI에서 OAuth2 인증 후 리다이렉트될 URL
      oauth: {
        clientId: process.env.KAKAO_CLIENT_ID!, // .env 에서 불러온 REST API 키
        //clientSecret: process.env.KAKAO_CLIENT_SECRET, // (선택) 보안 설정 시
        usePkceWithAuthorizationCodeGrant: false,
      },
    },
  });
}
