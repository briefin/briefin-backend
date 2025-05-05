// src/subscriber/dto/subscriber.dto.ts
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class SubscriberDto {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsUrl()
  profileImage?: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
