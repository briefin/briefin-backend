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

  /** 1) 내 퍼블리셔 아래 매거진 생성 */
  @Post(':publisherId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '매거진 생성 (해당 퍼블리셔로)' })
  async create(
    @Req() req: RequestWithUser,
    @Param('publisherId') publisherId: string, // <- 여기
    @Body() createMagazineDto: CreateMagazineDto,
  ) {
    // userId + publisherId 로 “내 것”인지 검증하고 불러오기
    const publisher = await this.publisherService.getOneByUserAndId(
      req.user.userId,
      publisherId,
    );
    if (!publisher) throw new NotFoundException('Publisher not found');

    return this.magazineService.create(
      String(publisher._id),
      createMagazineDto,
    );
  }

  /** 2) 내 퍼블리셔 아래 매거진 전체 조회 */
  @Get(':publisherId')
  @ApiOperation({ summary: '내 매거진 목록 조회 (publisherId 지정)' })
  async findAll(
    @Req() req: RequestWithUser,
    @Param('publisherId') publisherId: string,
  ) {
    // 소유권 검증
    const publisher = await this.publisherService.getOneByUserAndId(
      req.user.userId,
      publisherId,
    );
    if (!publisher) throw new NotFoundException('Publisher not found');

    return this.magazineService.findAll(String(publisher._id));
  }

  @Get(':magazineId')
  @ApiOperation({ summary: '매거진 상세 조회' })
  findOne(@Param('magazineId') magazineId: string) {
    return this.magazineService.findOne(magazineId);
  }

  /** 3) 내 퍼블리셔 아래 특정 매거진 수정 */
  @Put(':publisherId/:magazineId')
  @ApiOperation({ summary: '매거진 수정 (publisherId 지정)' })
  async update(
    @Req() req: RequestWithUser,
    @Param('publisherId') publisherId: string,
    @Param('magazineId') magazineId: string,
    @Body() dto: UpdateMagazineDto,
  ) {
    const publisher = await this.publisherService.getOneByUserAndId(
      req.user.userId,
      publisherId,
    );
    if (!publisher) throw new NotFoundException('Publisher not found');

    return this.magazineService.update(String(publisher._id), magazineId, dto);
  }

  /** 4) 내 퍼블리셔 아래 특정 매거진 삭제 */
  @Delete(':publisherId/:magazineId')
  @ApiOperation({ summary: '매거진 삭제 (publisherId 지정)' })
  async remove(
    @Req() req: RequestWithUser,
    @Param('publisherId') publisherId: string,
    @Param('magazineId') magazineId: string,
  ) {
    const publisher = await this.publisherService.getOneByUserAndId(
      req.user.userId,
      publisherId,
    );
    if (!publisher) throw new NotFoundException('Publisher not found');

    return this.magazineService.remove(String(publisher._id), magazineId);
  }
}
