import { Equals, IsNotEmpty, IsString } from 'class-validator';

export class ChangeUserPasswordDto {
  @IsNotEmpty({ message: 'Current password is required' })
  @IsString()
  currentPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @IsString()
  newPassword: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @IsString()
  @Equals('newPassword', {
    message: 'Confirm password must exactly match the new password',
  })
  confirmPassword: string;
}
