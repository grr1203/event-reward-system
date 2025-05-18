import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { RewardRequest } from '../schemas/reward-request.schema';

@Controller('reward-request')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  async create(
    @Req() req,
    @Body() createRewardRequestDto: CreateRewardRequestDto,
  ): Promise<RewardRequest> {
    if (!req.user?.id) {
      throw new UnauthorizedException('유저 확인 실패');
    }
    
    return this.rewardRequestService.create(req.user.id, createRewardRequestDto);
  }

  @Get('me')
  async findMine(@Req() req): Promise<RewardRequest[]> {
    if (!req.user?.id) {
      throw new UnauthorizedException('유저 확인 실패');
    }
    
    return this.rewardRequestService.findAllByUser(req.user.id);
  }

  @Get()
  async findAll(): Promise<RewardRequest[]> {
    return this.rewardRequestService.findAll();
  }
} 