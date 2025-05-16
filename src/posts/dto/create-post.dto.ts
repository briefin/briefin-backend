import { CreatePostBodyDto } from './create-post-body.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayNotEmpty } from 'class-validator';

/**
 * Controller에서 파일명을 주입해 Service 계층으로 넘길 때 사용하는 타입
 * → ValidationPipe 대상이 아님
 */
export class CreatePostDto extends CreatePostBodyDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    example: ['image1.jpg', 'image2.jpg'],
    description: '업로드 후 저장되는 이미지 파일명 배열',
  })
  @IsArray()
  @ArrayNotEmpty()
  images: string[];
}
