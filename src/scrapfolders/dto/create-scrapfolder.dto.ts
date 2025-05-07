import { IsString, IsOptional, MinLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateScrapFolderDto {
  @ApiProperty({ example: 'My Favorites' })
  @IsString()
  @MinLength(1)
  readonly name: string;

  @ApiProperty({ example: 'Articles I want to revisit', required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    example: 'https://cdn.myapp.com/covers/abcd1234.png',
    required: false,
    description: '스크랩북 커버 이미지 URL',
  })
  @IsOptional()
  @IsUrl()
  readonly coverImage?: string;
}
