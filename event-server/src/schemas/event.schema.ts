import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type EventDocument = Event & Document;

class Condition {
  type: string;
  value: any;
}

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Object })
  condition: Condition;

  @Prop({ enum: ['ACTIVE', 'INACTIVE'] })
  status: string;

  @Prop()
  startAt: Date;

  @Prop()
  endAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event); 