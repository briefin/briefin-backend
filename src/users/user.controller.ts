import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '회원가입 (로컬/소셜)' })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Patch('role')
  @ApiOperation({ summary: '역할 변경 (구독자 <-> 퍼블리셔)' })
  async updateRole(
    @Body() body: { userId: string; role: 'subscriber' | 'publisher' },
  ) {
    return this.userService.setRole(body.userId, body.role);
  }
}
