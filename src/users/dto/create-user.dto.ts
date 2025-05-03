import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'local' })
  provider: 'local' | 'kakao';

  @ApiProperty({ example: 'user123', required: false })
  username?: string;

  @ApiProperty({ example: 'password123', required: false })
  password?: string;

  @ApiProperty({ example: 'kakao_12345', required: false })
  socialId?: string;

  @ApiProperty({ example: false, required: false })
  isSocial?: boolean;
}
