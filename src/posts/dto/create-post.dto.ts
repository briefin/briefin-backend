import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  Length,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: '동묘앞 잠옷',
    description: '포스트 제목',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @ApiProperty({
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    description: '포스트 콘텐츠로 사용할 이미지 URL 배열',
  })
  @IsArray()
  @ArrayNotEmpty()
  //@IsString( {each: true })
  contents: string[];

  @ApiProperty({
    example: '2025년 동묘앞 유행하는 잠옷 패션을 알아보러 떠났다.',
    description: '포스트 설명 (선택)',
    maxLength: 500,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;
}
