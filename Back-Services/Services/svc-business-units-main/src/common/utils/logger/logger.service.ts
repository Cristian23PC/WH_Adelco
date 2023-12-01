import { Injectable, Scope } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends PinoLogger {
  log(message: string, obj?: unknown) {
    if (obj && Object.keys(obj).length) {
      super.info(obj, message);
      return;
    }
    super.info(message);
  }
}
