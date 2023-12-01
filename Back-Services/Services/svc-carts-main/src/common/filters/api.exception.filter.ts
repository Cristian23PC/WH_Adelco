import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ApiError } from '../errors/api.error';
import { LoggerService } from '@/common/utils/logger/logger.service';
import { DEFAULT_ERROR } from '@/common/constants/exceptions';
import loggerConfig from '@/config/logger.config';

@Catch(ApiError)
export class ApiErrorFilter implements ExceptionFilter {
  private readonly loggerService = new LoggerService(loggerConfig());
  catch(exception: ApiError, host: ArgumentsHost) {
    this.loggerService.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const msg = exception.message ?? DEFAULT_ERROR;
    const code = exception.code ?? undefined;
    response.status(status).json({
      statusCode: status,
      message: msg,
      code,
      meta: exception.meta
    });
  }
}
