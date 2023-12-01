import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '@/common/utils/logger/logger.service';
import { Eevents } from '@/common/middleware/enums/events.enum';
import loggerConfig from '@/config/logger.config';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  getDurationInMilliseconds = (start: [number, number]): number => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);
    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
  };

  use(request: Request, response: Response, next: NextFunction) {
    const logger = new LoggerService(loggerConfig());
    const { method, originalUrl: url } = request;
    const start = process.hrtime();

    logger.log(`${method} ${url} [STARTED]`, { method, url, context: 'HTTP' });

    response.on(Eevents.Finish, () => {
      const durationInMilliseconds = this.getDurationInMilliseconds(start);
      logger.log(`${method} ${url} [FINISHED] ${durationInMilliseconds.toLocaleString()}ms`, { method, url });
    });

    response.on(Eevents.Close, () => {
      const durationInMilliseconds = this.getDurationInMilliseconds(start);
      logger.log(`${method} ${url} [CLOSED] ${durationInMilliseconds.toLocaleString()}ms`, { method, url });
    });
    next();
  }
}
