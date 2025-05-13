import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

/**
 * JWT 토큰에서 꺼내질 req.user의 형태를 미리 인터페이스로 선언
 */
export interface JwtAuthUser {
  userId: string;
  isSubscriber: boolean;
  isPublisher: boolean;
}

@Injectable()
export class JwtAuthGuard extends NestAuthGuard('jwt') {
  /**
   * AuthGuard 의 handleRequest를 오버라이드하면서
   * user 파라미터에 JwtAuthUser 타입을 명시적으로 붙여 줍니다.
   */
  override handleRequest<TUser = any>(err: any, user: any): TUser {
    if (err || !user) {
      throw err || new UnauthorizedException('인증되지 않은 사용자입니다.');
    }
    return user as TUser;
  }
}

@Injectable()
export class KakaoAuthGuard extends NestAuthGuard('kakao') {
  // 특별히 커스터마이징할 게 없다면 빈 채로 두어도 됩니다.
}
