import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Length,
  MaxLength,
} from 'class-validator';

/** multipart/form-data 중 ‘텍스트 파트’만 검증 */
export class CreatePostBodyDto {
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
    example: '2025년 동묘앞 유행하는 잠옷 패션을 알아보러 떠났다.',
    description: '포스트 설명(선택)',
    maxLength: 2000,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  description?: string;
}
