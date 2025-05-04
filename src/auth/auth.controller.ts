// src/auth/auth.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

interface RefreshRequest extends Request {
  cookies: {
    refreshToken?: string;
  };
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  /** 일반 회원가입 */
  @Post('signup')
  @HttpCode(201)
  @ApiOperation({ summary: '일반 회원가입' })
  async signup(@Body() dto: SignupDto) {
    const { _id, isSubscriber, isPublisher } =
      await this.authService.signup(dto);
    return {
      message: '회원가입 완료',
      userId: _id,
      isSubscriber,
      isPublisher,
    };
  }

  /** 일반 로그인 */
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '일반 로그인' })
  async login(@Body() dto: LoginDto) {
    const { accessToken, userId, isSubscriber, isPublisher } =
      await this.authService.login(dto);
    return {
      message: '로그인 성공',
      accessToken,
      userId,
      isSubscriber,
      isPublisher,
    };
  }

  // ──────────────── 카카오 OAuth 시작 ────────────────

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 로그인 요청' })
  kakaoLogin() {
    // passport-kakao가 카카오 로그인 페이지로 리다이렉트 처리
  }

  // ──────────── 카카오 OAuth 콜백 처리 ────────────

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(302)
  @ApiOperation({ summary: '카카오 로그인 콜백' })
  async kakaoLoginCallback(
    @Req() req: Request & { user: { kakaoId: number } },
    @Res() res: Response,
  ) {
    const { kakaoId } = req.user;
    const { accessToken, refreshToken } =
      await this.authService.getJWT(kakaoId);

    // 쿠키 세팅
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('isLoggedIn', 'true', { httpOnly: false, sameSite: 'lax' });

    // 리다이렉트
    const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
    return res.redirect(clientUrl);
  }

  /** 토큰 리프레시 */
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: '액세스 토큰 갱신' })
  async refresh(@Req() req: RefreshRequest, @Res() res: Response) {
    const { refreshToken } = req.cookies; // string | undefined

    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }

    try {
      const newAccessToken: string =
        await this.authService.refresh(refreshToken);

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
      });
      return res.send({ message: '토큰 갱신 성공' });
    } catch {
      // 실패 시 모든 인증 관련 쿠키 삭제
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('isLoggedIn');
      throw new UnauthorizedException('토큰 갱신 실패');
    }
  }
}
