import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RewardService } from './reward.service';
import { CreateRewardDto } from './dto/create-reward.dto';
import { Reward } from '../schemas/reward.schema';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Post()
  async create(@Body() createRewardDto: CreateRewardDto): Promise<Reward> {
    return this.rewardService.create(createRewardDto);
  }

  @Get()
  async findAll(): Promise<Reward[]> {
    return this.rewardService.findAll();
  }

  @Get('event/:eventId')
  async findByEventId(@Param('eventId') eventId: string): Promise<Reward[]> {
    return this.rewardService.findByEventId(eventId);
  }
} 