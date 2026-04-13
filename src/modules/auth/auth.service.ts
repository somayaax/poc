import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AdminService } from '../admin/admin.service';
import { ApiException } from '../../common/api.exception';
import { AdminStatus, AuthRole, SuccessResponse } from '../../common/types';
import { buildSuccessResponse } from '../../common/utils';
import { LoginInput } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await user.validatePassword(password))) return user;
    return null;
  }

  async validateAdmin(email: string, password: string) {
    const admin = await this.adminService.findOne({ email });
    if (admin && (await admin.validatePassword(password))) return admin;
    return null;
  }

  async loginUser({ email, password }: LoginInput): Promise<SuccessResponse> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw ApiException.invalidCredentials();

    const valid = await user.validatePassword(password);
    if (!valid) throw ApiException.invalidCredentials();

    return buildSuccessResponse({
      message: 'Login successful',
      data: {
        token: this.jwtService.sign({
          sub: user._id,
          role: AuthRole.USER,
        }),
        mustChangePassword: Boolean(user.mustChangePassword),
      },
    });
  }

  async loginAdmin({ email, password }: LoginInput): Promise<SuccessResponse> {
    const admin = await this.adminService.findOne({ email });
    if (!admin) throw ApiException.invalidCredentials();

    if (admin.status === AdminStatus.INACTIVE)
      throw ApiException.invalidCredentials();

    const valid = await admin.validatePassword(password);
    if (!valid) throw ApiException.invalidCredentials();
    admin.lastLogin = new Date();
    await admin.save();

    return buildSuccessResponse({
      message: 'Login successful',
      data: {
        token: this.jwtService.sign({
          sub: admin._id,
          role: AuthRole.ADMIN,
          adminRoles: admin.roles,
        }),
        admin,
      },
    });
  }
}
