import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ timestamps: { createdAt: 'requestedAt', updatedAt: 'processedAt' } })
export class RewardRequest {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Reward', required: true })
  rewardId: MongooseSchema.Types.ObjectId;

  @Prop({ enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' })
  status: string;

  @Prop()
  reason: string;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest); 