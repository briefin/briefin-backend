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
import { ApiTags, ApiOperation, ApiCookieAuth } from '@nestjs/swagger';
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

  /** 일반 회원가입: 토큰 발급 및 쿠키 세팅 */
  @Post('signup')
  @HttpCode(201)
  @ApiOperation({ summary: '일반 회원가입' })
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // 1) 유저 생성 (이름/이메일/username/password, Subscriber 프로필 포함)
    const user = await this.authService.signup(dto);

    // 2) 토큰 발급
    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    // 3) 쿠키 세팅
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
    });
    res.cookie('isLoggedIn', 'true', {
      httpOnly: false,
      sameSite: 'lax',
      secure: isProd,
    });

    // 4) 응답
    return {
      message: '회원가입 완료',
      userId: user._id,
      isSubscriber: user.isSubscriber,
      isPublisher: user.isPublisher,
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
    // passport-kakao 가 카카오 로그인 페이지로 리다이렉트 처리
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
    const kakaoId = req.user.kakaoId;

    // getJWT 내부에서 유저 조회·생성 및 토큰 발급까지 처리
    const { accessToken, refreshToken } =
      await this.authService.getJWT(kakaoId);

    // 쿠키 세팅
    const isProd = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
    });
    res.cookie('isLoggedIn', 'true', {
      httpOnly: false,
      sameSite: 'lax',
      secure: isProd,
    });

    // 클라이언트 리다이렉트
    const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
    return res.redirect(clientUrl);
  }

  /** 액세스 토큰 갱신 */
  @Post('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: '액세스 토큰 갱신' })
  @ApiCookieAuth()
  async refresh(
    @Req() req: RefreshRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new UnauthorizedException('리프레시 토큰이 없습니다.');
    }

    try {
      const newAccessToken = await this.authService.refresh(refreshToken);

      // 쿠키 업데이트
      const isProd =
        this.configService.get<string>('NODE_ENV') === 'production';
      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
      });
      return { message: '토큰 갱신 성공' };
    } catch {
      // 실패 시 모든 인증 쿠키 삭제
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.clearCookie('isLoggedIn');
      throw new UnauthorizedException('토큰 갱신 실패');
    }
  }
}
