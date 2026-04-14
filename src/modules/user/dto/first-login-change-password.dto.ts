import { IsNotEmpty, IsString } from 'class-validator';

export class FirstLoginChangePasswordDto {
  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  newPassword: string;
}
