import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CommercetoolsError } from '@/nest-commercetools/errors';
import { LoggerService } from '@/common/utils/logger/logger.service';
import loggerConfig from '@/config/logger.config';
import { ErrorBuilder } from '../utils/error-builder/error-builder';

@Catch(CommercetoolsError)
export class CommercetoolsExceptionFilter implements ExceptionFilter {
  private readonly loggerService = new LoggerService(loggerConfig());
  catch(exception: CommercetoolsError, host: ArgumentsHost) {
    this.loggerService.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.body?.errors?.[0].message ?? exception.message;
    const code = ErrorBuilder.buildCommercetoolsCode(exception.body?.errors?.[0]?.code);
    response.status(statusCode).json({
      statusCode,
      message,
      code
    });
  }
}
