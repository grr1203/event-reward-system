import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest, RewardRequestDocument } from '../schemas/reward-request.schema';
import { CreateRewardRequestDto } from './dto/create-reward-request.dto';
import { EventService } from './event.service';
import { RewardService } from './reward.service';

@Injectable()
export class RewardRequestService {
  constructor(
    @InjectModel(RewardRequest.name) private rewardRequestModel: Model<RewardRequestDocument>,
    private eventService: EventService,
    private rewardService: RewardService,
  ) { }

  async create(userId: string, createRewardRequestDto: CreateRewardRequestDto): Promise<RewardRequest> {
    // 이벤트와 보상 존재 체크
    const event = await this.eventService.findOne(createRewardRequestDto.eventId);
    const rewards = await this.rewardService.findByEventId(createRewardRequestDto.eventId);
    if (!event) {
      throw new BadRequestException('이벤트가 존재하지 않습니다.');
    }
    if (rewards.length === 0) {
      throw new BadRequestException('보상이 존재하지 않습니다.');
    }

    // 이벤트 유효성 체크
    if (event.status !== 'ACTIVE') {
      throw new BadRequestException('비활성화된 이벤트입니다.');
    }
    const now = new Date();
    if (now < event.startAt || now > event.endAt) {
      throw new BadRequestException('이벤트 기간이 아닙니다.');
    }

    // 이미 보상을 받았는지 체크
    const existingRequest = await this.rewardRequestModel.findOne({
      userId,
      eventId: createRewardRequestDto.eventId,
      rewardId: createRewardRequestDto.rewardId,
      status: 'SUCCESS',
    }).exec();
    if (existingRequest) {
      throw new BadRequestException('이미 보상을 받았습니다.');
    }

    // 실제 보상 조건 검증 생략
    const status = 'SUCCESS'

    // 보상 지급 요청 기록
    const rewardRequest = new this.rewardRequestModel({
      userId,
      eventId: createRewardRequestDto.eventId,
      rewardId: createRewardRequestDto.rewardId,
      status
    });

    return rewardRequest.save();
  }

  async findAllByUser(userId: string): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find({ userId })
      .populate('eventId')
      .populate('rewardId')
      .exec();
  }

  async findAll(): Promise<RewardRequest[]> {
    return this.rewardRequestModel.find()
      .populate('eventId')
      .populate('rewardId')
      .exec();
  }
} 