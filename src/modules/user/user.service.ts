import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { ApiException } from '../../common/api.exception';
import { isPasswordPolicyCompliant } from '../../common/password-policy';
import { ChangeUserPasswordDto } from './dto/change-password.dto';
import { FirstLoginChangePasswordDto } from './dto/first-login-change-password.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async changePassword(
    user: User,
    dto: ChangeUserPasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = dto;

    if (currentPassword === newPassword) {
      throw new ApiException(
        'New password cannot be the same as the current password',
        'SAME_PASSWORD',
        400,
      );
    }

    if (!isPasswordPolicyCompliant(newPassword)) {
      throw ApiException.unprocessableEntity(
        'Password does not meet the password policy requirements.',
        'PASSWORD_POLICY_VIOLATION',
      );
    }

    const valid = await user.validatePassword(currentPassword);
    if (!valid) {
      throw new ApiException(
        'Invalid current password',
        'INVALID_CURRENT_PASSWORD',
        401,
      );
    }

    user.password = newPassword;
    await user.save();

    this.logger.log(
      `Password change: userId=${user._id?.toString()} at=${new Date().toISOString()}`,
    );

    return { message: 'Password changed successfully.' };
  }

  async firstLoginChangePassword(
    user: User,
    dto: FirstLoginChangePasswordDto,
  ): Promise<{ message: string }> {
    const { newPassword } = dto;

    if (!isPasswordPolicyCompliant(newPassword)) {
      this.logger.warn(
        `First-login password change failed (policy): userId=${user._id?.toString()} at=${new Date().toISOString()} result=failure reason=PASSWORD_POLICY_VIOLATION`,
      );
      throw new ApiException(
        'Password does not meet the password policy requirements.',
        'PASSWORD_POLICY_VIOLATION',
        400,
      );
    }

    user.password = newPassword;
    user.isPasswordChangeRequired = false;
    await user.save();

    this.logger.log(
      `First-login password change: userId=${user._id?.toString()} at=${new Date().toISOString()} result=success`,
    );

    return { message: 'Password changed successfully.' };
  }
}
