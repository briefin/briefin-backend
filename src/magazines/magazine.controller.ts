import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MagazineService } from './magazine.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
// import { JwtAuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';

@ApiTags('Magazines')
@Controller('magazines')
export class MagazineController {
  constructor(private readonly magazineService: MagazineService) {}

  @Post()
  @ApiOperation({ summary: '매거진 생성' })
  create(
    @Req() req: RequestWithUser,
    @Body() createMagazineDto: CreateMagazineDto,
  ) {
    return this.magazineService.create(req.user.userId, createMagazineDto);
  }

  @Get()
  @ApiOperation({ summary: '내 매거진 목록 조회' })
  findAll(@Req() req: RequestWithUser) {
    return this.magazineService.findAll(req.user.userId);
  }

  @Get(':magazineId')
  @ApiOperation({ summary: '매거진 상세 조회' })
  findOne(
    @Req() req: RequestWithUser,
    @Param('magazineId') magazineId: string,
  ) {
    return this.magazineService.findOne(req.user.userId, magazineId);
  }

  @Put(':magazineId')
  @ApiOperation({ summary: '매거진 수정' })
  update(
    @Req() req: RequestWithUser,
    @Param('magazineId') magazineId: string,
    @Body() updateMagazineDto: UpdateMagazineDto,
  ) {
    return this.magazineService.update(
      req.user.userId,
      magazineId,
      updateMagazineDto,
    );
  }

  @Delete(':magazineId')
  @ApiOperation({ summary: '매거진 삭제' })
  remove(@Req() req: RequestWithUser, @Param('magazineId') magazineId: string) {
    return this.magazineService.remove(req.user.userId, magazineId);
  }
}
