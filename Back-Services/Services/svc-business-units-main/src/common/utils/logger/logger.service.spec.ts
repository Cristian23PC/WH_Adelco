import { PinoLogger } from 'nestjs-pino';
import { LoggerService } from '@/common/utils';

describe('LoggerService', () => {
  const loggerService = new LoggerService({});
  it('log() should be called with context', () => {
    const context: object = {
      testProp1: 'test',
      testProp2: 'test'
    };
    PinoLogger.prototype.info = jest.fn();
    jest.spyOn(loggerService, 'log');
    loggerService.log('test', context);
    loggerService.log('test');
    expect(loggerService.log).toBeCalledWith('test', context);
  });
});
