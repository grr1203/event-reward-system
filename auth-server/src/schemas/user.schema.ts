import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export type Role = 'USER' | 'AUDITOR' | 'OPERATOR' | 'ADMIN';
export const ROLES_ARRAY: Role[] = ['USER', 'AUDITOR', 'OPERATOR', 'ADMIN'];

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ROLES_ARRAY, default: 'USER' })
  role: Role;

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User); 