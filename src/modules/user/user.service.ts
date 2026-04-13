import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { ChangePasswordInput } from './dto/change-password.dto';
import { ApiException } from '../../common/api.exception';
import { buildSuccessResponse } from '../../common/utils';
import { PasswordChange } from './password-change.schema';

@Injectable()
export class UserService {
  private static readonly RATE_WINDOW_MS = 60_000;
  private static readonly RATE_LIMIT_ATTEMPTS = 5;
  private static readonly rateLimitStore = new Map<string, number[]>();

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(PasswordChange.name)
    private passwordChangeModel: Model<PasswordChange>,
  ) {}

  async findById(id: string) {
    return await this.userModel.findById(id);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  private enforceRateLimit(identifier: string): void {
    const now = Date.now();
    const attempts = UserService.rateLimitStore.get(identifier) ?? [];
    const recentAttempts = attempts.filter(
      (attempt) => now - attempt <= UserService.RATE_WINDOW_MS,
    );

    if (recentAttempts.length >= UserService.RATE_LIMIT_ATTEMPTS) {
      throw new ApiException(
        'Too many password change attempts. Please try again later.',
        'RATE_LIMITED',
        429,
      );
    }

    recentAttempts.push(now);
    UserService.rateLimitStore.set(identifier, recentAttempts);
  }

  async changePassword(
    user: User,
    input: ChangePasswordInput,
    ipAddress: string,
    userAgent: string,
  ) {
    const { current_password, new_password, confirm_password } = input;

    this.enforceRateLimit(`${user._id.toString()}:${ipAddress}`);

    if (new_password !== confirm_password) {
      throw new ApiException('Passwords do not match.', 'INVALID_INPUT', 400);
    }

    const valid = await user.validatePassword(current_password);
    if (!valid) {
      throw new ApiException(
        'Incorrect email or password.',
        'INVALID_INPUT',
        400,
      );
    }

    user.password = new_password;
    user.mustChangePassword = false;
    await user.save();

    await this.passwordChangeModel.create({
      user_id: user._id.toString(),
      changed_at: new Date(),
      ip_address: ipAddress,
      user_agent: userAgent || 'unknown',
    });

    return buildSuccessResponse({
      message: 'Password changed successfully.',
    });
  }
}
