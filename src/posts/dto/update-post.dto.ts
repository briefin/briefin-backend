// src/posts/dto/update-post.dto.ts
export class ImageItemDto {
  url: string;
  order?: number;
}

export class UpdatePostDto {
  readonly title?: string;
  readonly description?: string;
  readonly contents?: ImageItemDto[]; // ← 여기 수정!
}
