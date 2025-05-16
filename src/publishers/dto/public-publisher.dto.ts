import { ApiProperty } from '@nestjs/swagger';

export class PublicPublisherDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty({ required: false })
  bio?: string;

  subscribers?: { _id: string }[];

  @ApiProperty({ description: '구독자 수' })
  subscriberCount: number;

  @ApiProperty({ required: false })
  profileImage?: string;

  @ApiProperty({
    description: '퍼블리셔가 발행한 매거진 요약 목록',
    type: [Object],
    required: false,
  })
  publishedMagazines?: { _id: string; title: string; coverImage?: string }[];
}
