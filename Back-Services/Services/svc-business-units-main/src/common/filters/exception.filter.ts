import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from '@/common/utils/logger/logger.service';
import { DEFAULT_ERROR } from '@/common/constants/exceptions';
import loggerConfig from '@/config/logger.config';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly loggerService = new LoggerService(loggerConfig());
  catch(exception: unknown, host: ArgumentsHost): void {
    this.loggerService.error(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof HttpException ? exception['response']?.message || exception.message : DEFAULT_ERROR;
    const responseBody = {
      statusCode: httpStatus,
      message
    };
    response.status(httpStatus).json(responseBody);
  }
}
