import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateMagazineDto {
  /** 매거진 제목 */
  @ApiProperty({
    description: '매거진 제목',
    example: '생생정보통 맛집집',
  })
  @IsString()
  title: string;

  /** 매거진 설명 */
  @ApiPropertyOptional({
    description: '매거진 설명',
    example: '생생정보통에 나왔던 그 맛집들, 지금 소개합니다.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /** 소속 퍼블리셔 ID */
  @ApiProperty({
    description: '소속 퍼블리셔 ID',
    example: '663a91b1b547c2216ae405e3',
  })
  @IsMongoId()
  publisher: string;

  /** 커버 이미지 URL */
  @ApiPropertyOptional({
    description: '커버 이미지 URL',
    example: 'https://example.com/cover.jpg',
  })
  @IsOptional()
  @IsString()
  coverImage?: string;

  /** 발행 여부 */
  @ApiPropertyOptional({
    description: '발행 여부',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
