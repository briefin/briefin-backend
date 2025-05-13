import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard, JwtAuthUser } from './auth/auth.guard';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  @UseGuards(JwtAuthGuard)
  @Get()
  get(
    @Req() req: Request & { user: JwtAuthUser }, // ← 여기를 이렇게!
  ) {
    // 이제 req.user 가 항상 JwtAuthUser 타입으로 인식됩니다.
    console.log(req.user.userId);
    return 'JWT 인증 성공';
  }
}
