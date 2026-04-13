import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { AdminRole, AuthRole, DecoratorKey } from './types';

export const CurrentUser = createParamDecorator(
  (type: AuthRole, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (type === AuthRole.USER) return request.user;
    if (type === AuthRole.ADMIN) return request.admin;
  },
);

export const IgnoreChangePasswordCheck = () =>
  SetMetadata(DecoratorKey.IGNORE_CHANGE_PASSWORD, true);

export const Roles = (...roles: AdminRole[]) =>
  SetMetadata(DecoratorKey.ROLES, roles);
