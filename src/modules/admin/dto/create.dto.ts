import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
} from 'class-validator';
import { AdminRole, AdminStatus } from '../../../common/types';

export class CreateAdminInput {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsArray()
  @IsEnum(AdminRole, { each: true })
  roles: AdminRole[];

  @IsNotEmpty()
  @IsEnum(AdminStatus)
  status: AdminStatus;
}
