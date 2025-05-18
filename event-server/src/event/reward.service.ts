import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward, RewardDocument } from '../schemas/reward.schema';
import { CreateRewardDto } from './dto/create-reward.dto';

@Injectable()
export class RewardService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<RewardDocument>
  ) {}

  async create(createRewardDto: CreateRewardDto): Promise<Reward> {
    const reward = new this.rewardModel(createRewardDto);
    return reward.save();
  }

  async findAll(): Promise<Reward[]> {
    return this.rewardModel.find().populate('eventId').exec();
  }

  async findByEventId(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId }).exec();
  }
} 