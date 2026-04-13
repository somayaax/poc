import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { UserService } from './user.service';
import { CurrentUser } from '../../common/decorators';
import { AuthRole, SuccessResponse } from '../../common/types';
import { User } from './user.schema';
import { ChangePasswordInput } from './dto/change-password.dto';
import { Request } from 'express';

@Controller('api/users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('change-password')
  async changePassword(
    @CurrentUser(AuthRole.USER) user: User,
    @Body() input: ChangePasswordInput,
    @Req() request: Request,
  ): Promise<SuccessResponse> {
    const ipAddress = request.ip || request.socket.remoteAddress || 'unknown';
    const userAgent = request.get('user-agent') || 'unknown';

    return this.userService.changePassword(user, input, ipAddress, userAgent);
  }
}
