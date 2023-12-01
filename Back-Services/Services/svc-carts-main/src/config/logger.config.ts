import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';

// https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const PinoLevelToSeverityLookup = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL'
};

export default registerAs('logger', () => {
  const isLocal = !['development', 'prod', 'qa'].includes(process.env.ENVIRONMENT);
  return {
    pinoHttp: {
      ...(!isLocal && { messageKey: 'message' }),
      formatters: {
        ...(!isLocal && { messageKey: 'message' }),
        level(label, number) {
          return {
            severity: PinoLevelToSeverityLookup[label] || PinoLevelToSeverityLookup['info'],
            level: number
          };
        }
      },
      customProps: () => ({
        context: 'HTTP'
      }),
      transport: isLocal
        ? {
            target: 'pino-pretty',
            options: {
              sync: true,
              singleLine: true
            }
          }
        : undefined
    }
  } as Params;
});
