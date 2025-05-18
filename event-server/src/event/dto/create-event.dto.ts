import { IsDateString, IsEnum, IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ConditionDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  value: any;
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ConditionDto)
  condition: ConditionDto;

  @IsEnum(['ACTIVE', 'INACTIVE'])
  status: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;
} 