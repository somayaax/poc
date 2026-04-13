import { HttpException } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    public message: string,
    public code: string = 'ERROR',
    status: number = 400,
  ) {
    super({ message, code }, status);
  }

  static invalidCredentials(
    message = 'Invalid credentials',
    code = 'UNAUTHORIZED',
  ) {
    return new ApiException(message, code, 401);
  }

  static unauthorized(
    message = 'you are not authorized to perform this action',
    code = 'UNAUTHORIZED',
  ) {
    return new ApiException(message, code, 401);
  }

  static notFound(message = 'Not found', code = 'NOT_FOUND') {
    return new ApiException(message, code, 404);
  }

  static forbidden(
    message = 'You do not have permission to perform this action',
    code = 'FORBIDDEN',
  ) {
    return new ApiException(message, code, 403);
  }
}
