import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserOnlyGuard } from '../auth/guards/user-only.guard';
import { UserService } from './user.service';
import { ChangeUserPasswordDto } from './dto/change-password.dto';
import { FirstLoginChangePasswordDto } from './dto/first-login-change-password.dto';
import { CurrentUser, IgnoreChangePasswordCheck } from '../../common/decorators';
import { AuthRole } from '../../common/types';
import { User } from './user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(ThrottlerGuard, JwtGuard, UserOnlyGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser(AuthRole.USER) user: User,
    @Body() dto: ChangeUserPasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.changePassword(user, dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @IgnoreChangePasswordCheck()
  @UseGuards(ThrottlerGuard, JwtGuard, UserOnlyGuard)
  @Post('first-login/change-password')
  async firstLoginChangePassword(
    @CurrentUser(AuthRole.USER) user: User,
    @Body() dto: FirstLoginChangePasswordDto,
  ): Promise<{ message: string }> {
    return this.userService.firstLoginChangePassword(user, dto);
  }
}
