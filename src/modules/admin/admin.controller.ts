import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/admin.guard';
import { AdminService } from './admin.service';
import { AdminRole, AuthRole, SuccessResponse } from '../../common/types';
import { CreateAdminInput } from './dto/create.dto';
import {
  CurrentUser,
  IgnoreChangePasswordCheck,
  Roles,
} from '../../common/decorators';
import { Admin } from './admin.schema';
import { ChangePasswordInput } from './dto/change-password.dto';

@Controller('admin')
@UseGuards(JwtGuard)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Roles(AdminRole.ADMIN_MNGT)
  @UseGuards(RolesGuard)
  @Post()
  async createAdmin(@Body() input: CreateAdminInput): Promise<SuccessResponse> {
    return this.adminService.create(input);
  }

  @IgnoreChangePasswordCheck()
  @UseGuards(JwtGuard)
  @Post('change-password')
  async changePassword(
    @CurrentUser(AuthRole.ADMIN) admin: Admin,
    @Body() input: ChangePasswordInput,
  ): Promise<SuccessResponse> {
    return this.adminService.changePassword(admin, input);
  }
}
