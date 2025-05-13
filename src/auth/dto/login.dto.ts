import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user1' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123!' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
