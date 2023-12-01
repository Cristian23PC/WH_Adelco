import loggerConfig from '@/config/logger.config';
import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends PinoLogger {
  constructor(config = loggerConfig()) {
    super(config);
  }

  log(message: string, obj?: unknown) {
    if (obj && Object.keys(obj).length) {
      super.info(obj, message);
      return;
    }
    super.info(message);
  }
}
