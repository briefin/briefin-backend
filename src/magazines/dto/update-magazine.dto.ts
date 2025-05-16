// src/magazines/dto/update-magazine.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateMagazineDto } from './create-magazine.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateMagazineDto extends PartialType(CreateMagazineDto) {
  @ApiPropertyOptional({ example: '여름호 매거진' })
  title?: string;

  @ApiPropertyOptional({
    example: '뜨거운 여름을 시원하게 해 줄 맛집들을 담았습니다.',
  })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/assets/summer-cover.jpg',
  })
  coverImage?: string;

  @ApiPropertyOptional({ example: true })
  isPublished?: boolean;
}
