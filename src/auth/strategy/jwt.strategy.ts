import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

export interface JwtPayload {
  sub: string; // MongoDB _id
  isSubscriber: boolean;
  isPublisher: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    } satisfies StrategyOptions);
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      isSubscriber: payload.isSubscriber,
      isPublisher: payload.isPublisher,
    };
  }
}
