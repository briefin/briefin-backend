import { IsString, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateMagazineDto {
  /** 매거진 제목 */
  @IsString()
  title: string;

  /** 매거진 설명 */
  @IsOptional()
  @IsString()
  description?: string;

  /** 소속 퍼블리셔 ID */
  @IsMongoId()
  publisher: string;

  /** 커버 이미지 URL */
  @IsOptional()
  @IsString()
  coverImage?: string;

  /** 발행 여부 */
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
