import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

export interface KakaoStrategyOptions {
  clientID: string;
  clientSecret?: string;
  callbackURL?: string;
}

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get('KAKAO_CLIENT_ID') as string,
      clientSecret: configService.get('KAKAO_CLIENT_SECRET') as string,
      callbackURL: `${configService.get('BACKEND_URL') as string}/auth/kakao/callback`,
    } satisfies KakaoStrategyOptions);
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile & { _json: { id: number } },
  ): Promise<{ kakaoId: string }> {
    const { id } = profile._json as { id: string };
    return Promise.resolve({ kakaoId: id });
  }
}
