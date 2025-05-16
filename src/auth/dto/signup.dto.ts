import {
  IsEnum,
  ValidateIf,
  IsDefined,
  IsString,
  MinLength,
  IsEmail,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    example: 'local',
    enum: ['local', 'kakao'],
  })
  @IsEnum(['local', 'kakao'])
  provider!: 'local' | 'kakao';

  // ─── local only ────────────────────────────────────────────────────────────

  @ApiProperty({ example: '떠으니', required: false })
  @ValidateIf((o: SignupDto) => o.provider === 'local')
  @IsDefined({ message: 'name is required when provider=local' })
  @IsString()
  name?: string;

  @ApiProperty({ example: '2222@naver.com', required: false })
  @ValidateIf((o: SignupDto) => o.provider === 'local')
  @IsDefined({ message: 'email is required when provider=local' })
  @IsEmail({}, { message: '유효한 이메일을 입력해주세요.' })
  email?: string;

  @ApiProperty({ example: 'user1', required: false })
  @ValidateIf((o: SignupDto) => o.provider === 'local')
  @IsDefined({ message: 'username is required when provider=local' })
  @IsString()
  username?: string;

  @ApiProperty({ example: 'password123!', required: false })
  @ValidateIf((o: SignupDto) => o.provider === 'local')
  @IsDefined({ message: 'password is required when provider=local' })
  @IsString()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  password?: string;

  // ─── kakao only ────────────────────────────────────────────────────────────

  @ApiProperty({ example: 'kakao_12345', required: false })
  @ValidateIf((o: SignupDto) => o.provider === 'kakao')
  @IsDefined({ message: 'socialId is required when provider=kakao' })
  @IsString()
  socialId?: string;

  // ─── profile flags ─────────────────────────────────────────────────────────

  @ApiProperty({
    example: true,
    description: '가입 시 구독자 프로필 보유 여부 (default: true)',
    required: false,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isSubscriber: boolean = true;

  @ApiProperty({
    example: false,
    description: '퍼블리셔 프로필 보유 여부 (default: false)',
    required: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isPublisher: boolean = false;
}
