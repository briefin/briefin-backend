import {
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  IsDefined,
  IsBoolean,
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

  @ApiProperty({ example: 'user1', required: false })
  @ValidateIf((o: SignupDto) => o.provider === 'local')
  @IsDefined({ message: 'username is required when provider=local' })
  @IsString()
  username?: string;

  @ApiProperty({ example: 'password123!', required: false })
  @ValidateIf((o: SignupDto) => o.provider === 'local')
  @IsDefined({ message: 'password is required when provider=local' })
  @IsString()
  @MinLength(8)
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
