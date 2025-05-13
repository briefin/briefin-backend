import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: '첫 번째 포스트 제목' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '포스트 내용' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
