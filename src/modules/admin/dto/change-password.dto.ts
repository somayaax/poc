import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ChangePasswordInput {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @IsString()
  newPassword: string;
}
