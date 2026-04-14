// src/common/filters/global-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string | string[];
    let code: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (
        exception instanceof BadRequestException &&
        typeof res === 'object' &&
        Array.isArray((res as any).message)
      ) {
        message = (res as any).message;
        code = 'INVALID_INPUT';
      } else if (typeof res === 'string') {
        message = res;
        code = exception.name;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message || exception.message;
        code = (res as any).code || exception.name;
      } else {
        message = exception.message;
        code = exception.name;
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      this.logger.error((exception as any)?.message);
      message = 'Internal server error';
      code = 'INTERNAL_ERROR';
    }

    response.status(status).json({
      success: false,
      message,
      code,
    });
  }
}
