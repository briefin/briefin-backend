import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePublisherDto {
  @ApiProperty({
    description: '닉네임',
    example: '홍길동',
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiPropertyOptional({
    description: '프로필 이미지 URL',
    example: 'https://example.com/profile.jpg',
  })
  @IsString()
  @IsOptional()
  profileImage?: string;

  @ApiPropertyOptional({
    description: '자기소개',
    example: '반갑습니다! 홍길동입니다.',
  })
  @IsString()
  @IsOptional()
  bio?: string;
} 