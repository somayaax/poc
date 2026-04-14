import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ApiException } from '../../../common/api.exception';

/**
 * Ensures the JWT belongs to a regular user (profile routes), not an admin.
 */
@Injectable()
export class UserOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      throw ApiException.forbidden(
        'This action is only available to user accounts',
        'USER_ONLY',
      );
    }
    return true;
  }
}
