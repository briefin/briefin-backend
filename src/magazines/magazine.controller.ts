import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Put,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MagazineService } from './magazine.service';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
// import { JwtAuthGuard } from '../auth/auth.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { PublisherService } from '../publishers/publisher.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth('access-token')
@ApiTags('Magazines')
@Controller('magazines')
export class MagazineController {
  constructor(
    private readonly magazineService: MagazineService,
    private readonly publisherService: PublisherService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '매거진 생성' })
  async create(
    @Req() req: RequestWithUser,
    @Body() createMagazineDto: CreateMagazineDto,
  ) {
    // 1. userId로 publisherId 조회
    const publisher = await this.publisherService.getByUserId(req.user.userId);
    if (!publisher) throw new NotFoundException('Publisher not found');
    // 2. publisherId로 매거진 생성
    return this.magazineService.create(publisher._id as string, createMagazineDto);
  } // ...createMagazineDto 를 통해 이 객체의 속성을 돌려주는 것이 프론트에게 도움이 되는지는 추후 피드백 필요

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '내 매거진 목록 조회' })
  async findAll(@Req() req: RequestWithUser) {
    const publisher = await this.publisherService.getByUserId(req.user.userId);
    if (!publisher) throw new NotFoundException('Publisher not found');
    return this.magazineService.findAll(publisher._id as string);
  }

  @Get(':magazineId')
  @ApiOperation({ summary: '매거진 상세 조회' })
  findOne(@Param('magazineId') magazineId: string) {
    return this.magazineService.findOne(magazineId);
  }

  @Put(':magazineId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '매거진 수정' })
  async update(
    @Req() req: RequestWithUser,
    @Param('magazineId') magazineId: string,
    @Body() updateMagazineDto: UpdateMagazineDto,
  ) {
    const publisher = await this.publisherService.getByUserId(req.user.userId);
    if (!publisher) throw new NotFoundException('Publisher not found');
    return this.magazineService.update(
      publisher._id as string,
      magazineId,
      updateMagazineDto,
    );
  }

  @Delete(':magazineId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '매거진 삭제' })
  async remove(@Req() req: RequestWithUser, @Param('magazineId') magazineId: string) {
    const publisher = await this.publisherService.getByUserId(req.user.userId);
    if (!publisher) throw new NotFoundException('Publisher not found');
    return this.magazineService.remove(publisher._id as string, magazineId);
  }
}
