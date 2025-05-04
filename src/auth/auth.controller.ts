import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: '일반 회원가입' })
  async signup(@Body() dto: SignupDto) {
    await this.authService.signup(dto);
    return { message: '회원가입 완료' };
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '일반 로그인' })
  async login(@Body() dto: LoginDto) {
    const { accessToken, userId, role } = await this.authService.login(dto);
    return {
      message: '로그인 성공',
      accessToken,
      userId,
      role,
    };
  }
}
