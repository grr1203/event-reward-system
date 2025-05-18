import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RewardDocument = Reward & Document;

@Schema({ timestamps: true })
export class Reward {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Event', required: true })
  eventId: MongooseSchema.Types.ObjectId;

  @Prop({ enum: ['POINT', 'COUPON', 'ITEM'] })
  type: string;

  @Prop()
  value: string;

  @Prop()
  description: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward); 