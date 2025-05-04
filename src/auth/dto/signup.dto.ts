import {
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  IsDefined,
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

  // ─── shared ────────────────────────────────────────────────────────────────

  @ApiProperty({
    example: 'subscriber',
    enum: ['subscriber', 'publisher'],
    required: false,
  })
  @IsEnum(['subscriber', 'publisher'])
  @IsOptional()
  role?: 'subscriber' | 'publisher' = 'subscriber';
}
