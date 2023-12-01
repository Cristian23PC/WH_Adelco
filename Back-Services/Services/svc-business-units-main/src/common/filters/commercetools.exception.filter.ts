import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CommercetoolsError } from '@/nest-commercetools/errors';
import { LoggerService } from '@/common/utils/logger/logger.service';
import { NOT_FOUND_MESSAGE } from '../constants/exceptions';
import loggerConfig from '@/config/logger.config';

@Catch(CommercetoolsError)
export class CommercetoolsExceptionFilter implements ExceptionFilter {
  private readonly loggerService = new LoggerService(loggerConfig());
  catch(exception: CommercetoolsError, host: ArgumentsHost) {
    this.loggerService.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const msg = status === HttpStatus.NOT_FOUND ? NOT_FOUND_MESSAGE : exception.body?.errors?.map(({ message }) => message) ?? [exception.message];
    response.status(status).json({
      statusCode: status,
      message: msg
    });
  }
}
