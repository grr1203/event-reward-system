import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateRewardDto {
  @IsMongoId()
  eventId: string;

  @IsEnum(['POINT', 'COUPON', 'ITEM'])
  type: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ValidateIf(o => o.type === 'ITEM')
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ValidateIf(o => o.type === 'POINT')
  @IsEnum(['MESO', 'MILEAGE'])
  currency: string;

  @ValidateIf(o => o.type === 'COUPON')
  @IsString()
  @IsNotEmpty()
  couponCode: string;

  @IsString()
  @IsNotEmpty()
  description: string;
} 