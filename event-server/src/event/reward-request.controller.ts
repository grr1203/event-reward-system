import { Body, Controller, Get, Post, Req, UseGuards, UnauthorizedException, Query, Headers } from '@nestjs/common';
import { RewardRequestService } from './reward-request.service';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { RewardRequest } from '../schemas/reward-request.schema';

@Controller('reward-request')
export class RewardRequestController {
  constructor(private readonly rewardRequestService: RewardRequestService) {}

  @Post()
  async create(
    @Headers() headers,
    @Body() createRewardRequestDto: CreateRewardRequestDto,
  ): Promise<RewardRequest> {
    const userId = headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedException('유저 확인 실패');
    }
    
    return this.rewardRequestService.create(userId, createRewardRequestDto);
  }

  @Get('me')
  async findMine(@Headers() headers): Promise<RewardRequest[]> {
    const userId = headers['x-user-id'];
    if (!userId) {
      throw new UnauthorizedException('유저 확인 실패');
    }
    
    return this.rewardRequestService.findAllByUser(userId);
  }

  @Get()
  async findAll(
    @Query('conditionType') conditionType?: string,
    @Query('status') status?: string,
  ): Promise<RewardRequest[]> {
    return this.rewardRequestService.findAll(conditionType, status);
  }
} 