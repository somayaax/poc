import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiException } from '../../../common/api.exception';
import { UserService } from '../../user/user.service';
import { AuthRole, DecoratorKey } from '../../../common/types';
import { AdminService } from '../../admin/admin.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly adminService: AdminService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiException.unauthorized('Token missing', 'TOKEN_MISSING');
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token);

      if (payload.role == AuthRole.USER) {
        const user = await this.userService.findById(payload.sub);

        if (!user)
          throw ApiException.unauthorized('User not found', 'USER_NOT_FOUND');

        request.user = user;
      } else if (payload.role == AuthRole.ADMIN) {
        const admin = await this.adminService.findById(payload.sub);
        if (!admin)
          throw ApiException.unauthorized('Admin not found', 'ADMIN_NOT_FOUND');

        const ignore = this.reflector.get<boolean>(
          DecoratorKey.IGNORE_CHANGE_PASSWORD,
          context.getHandler(),
        );

        if (!ignore && admin.mustChangePassword)
          throw ApiException.forbidden(
            'Admin must change password before performing any action',
            'MUST_CHANGE_PASSWORD',
          );

        request.admin = admin;
      } else {
        throw ApiException.unauthorized('Invalid token', 'INVALID_TOKEN');
      }

      return true;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw ApiException.unauthorized(
        'Invalid or expired token',
        'INVALID_TOKEN',
      );
    }
  }
}
