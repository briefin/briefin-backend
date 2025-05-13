// src/subscriber/dto/subscriber.dto.ts
import { IsString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SubscriberDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '변경할 닉네임',
    example: '새로운닉네임123',
  })
  nickname?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '변경할 프로필 이미지 URL',
    example: 'https://cdn.example.com/avatar.png',
  })
  profileImage?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '변경할 자기소개',
    example: '안녕하세요, 반갑습니다!',
  })
  bio?: string;
}
