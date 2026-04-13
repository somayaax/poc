import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiException } from '../../../common/api.exception';
import { AdminRole, DecoratorKey } from '../../../common/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      DecoratorKey.ROLES,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const admin = request.admin;

    if (!admin) throw ApiException.unauthorized();

    if (admin.isSuperAdmin) return true;

    const hasAccess = requiredRoles.some((role) => admin.roles?.includes(role));

    if (!hasAccess) throw ApiException.forbidden();

    return true;
  }
}
@Injectable()
export class SuperAdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const admin = request.admin;

    if (!admin) throw ApiException.unauthorized();

    if (!admin.isSuperAdmin) throw ApiException.forbidden();

    return true;
  }
}
