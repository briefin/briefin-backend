// src/scrapfolder/dto/update-scrapfolder.dto.ts
import { IsString, IsOptional, MinLength, IsUrl } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateScrapFolderDto {
  @ApiPropertyOptional({
    example: 'Updated Favorites',
    description: '폴더 이름',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly name?: string;

  @ApiPropertyOptional({ example: '새로운 설명', description: '폴더 설명' })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.myapp.com/covers/updated.png',
    description: '스크랩북 커버 이미지 URL',
  })
  @IsOptional()
  @IsUrl()
  readonly coverImage?: string;
}
