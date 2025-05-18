import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { RewardController } from './reward.controller';
import { RewardService } from './reward.service';
import { RewardRequestController } from './reward-request.controller';
import { RewardRequestService } from './reward-request.service';
import { Event, EventSchema } from '../schemas/event.schema';
import { Reward, RewardSchema } from '../schemas/reward.schema';
import { RewardRequest, RewardRequestSchema } from '../schemas/reward-request.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Event.name, schema: EventSchema },
      { name: Reward.name, schema: RewardSchema },
      { name: RewardRequest.name, schema: RewardRequestSchema },
    ]),
  ],
  controllers: [EventController, RewardController, RewardRequestController],
  providers: [EventService, RewardService, RewardRequestService],
  exports: [EventService, RewardService, RewardRequestService],
})
export class EventModule {} 