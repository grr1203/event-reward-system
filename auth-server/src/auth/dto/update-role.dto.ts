import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role, ROLES_ARRAY } from '../../schemas/user.schema';

export class UpdateRoleDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsEnum(ROLES_ARRAY)
  role: Role;
}

export class RoleResponseDto {
  id: string;
  role: string;
} 