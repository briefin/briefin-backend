// src/@types/passport-kakao/index.d.ts
import { Strategy as PassportStrategy } from 'passport';
import { Profile as PassportProfile } from 'passport';

declare module 'passport-kakao' {
  export class Strategy extends PassportStrategy {
    constructor(
      options: {
        clientID: string;
        clientSecret?: string;
        callbackURL?: string;
      },
      verify?: (
        accessToken: string,
        refreshToken: string,
        profile: PassportProfile & { _json: any },
        done: (err: Error | null, user?: any) => void,
      ) => void,
    );
  }
  export interface Profile extends PassportProfile {
    _json: {
      id: number;
      // 필요하다면 여기에 카카오가 실제 보내주는 프로퍼티들(이메일, 프로필사진 등)을 추가로 선언
      nickname?: string;
      profile_image?: string;
    };
  }
}
