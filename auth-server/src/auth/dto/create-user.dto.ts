import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../schemas/user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(['USER', 'AUDITOR', 'OPERATOR', 'ADMIN'])
  role: Role;
}

export class UserResponseDto {
  id: string;
  name: string;
  role: string;
} 