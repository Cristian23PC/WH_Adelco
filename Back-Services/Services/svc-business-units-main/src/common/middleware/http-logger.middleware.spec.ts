import { HttpLoggerMiddleware } from './http-logger.middleware';
import { Eevents } from '@/common/middleware/enums/events.enum';

const mockLoggerService = {
  log: jest.fn((message: string) => message)
};
jest.mock('@/common/utils/logger/logger.service', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

describe('HttpLoggerMiddleware', () => {
  let httpLoggerMiddleware: HttpLoggerMiddleware;
  const oldToLocaleString = Number.prototype.toLocaleString;

  beforeAll(() => {
    const toLocaleStringMock = jest.fn(() => '1,000');
    Number.prototype.toLocaleString = toLocaleStringMock;
  });

  afterAll(() => {
    Number.prototype.toLocaleString = oldToLocaleString;
  });

  beforeEach(() => {
    httpLoggerMiddleware = new HttpLoggerMiddleware();
  });

  describe('getDurationInMilliseconds', () => {
    it('should return the duration in milliseconds', () => {
      jest.spyOn(process, 'hrtime').mockImplementation(() => [1, 1]);
      expect(httpLoggerMiddleware.getDurationInMilliseconds([1, 1])).toBe(1000.000001);
    });
  });

  describe('use', () => {
    let mockRequest: any;
    let mockResponse: any;
    let mockNext: jest.Mock;

    beforeEach(() => {
      mockRequest = { method: 'GET', originalUrl: '/test' };
      mockResponse = {
        on: jest.fn((event: string, listener: () => void) => {
          if (event === Eevents.Finish) {
            listener();
          } else if (event === Eevents.Close) {
            listener();
          }
        })
      };
      mockNext = jest.fn();
    });

    describe('[STARTED]', () => {
      it('should log the correct message when request starts', () => {
        httpLoggerMiddleware.use(mockRequest, mockResponse, mockNext);

        expect(mockLoggerService.log).toHaveBeenCalledWith('GET /test [STARTED]', { method: 'GET', url: '/test' });
      });
    });

    describe('[FINISHED]', () => {
      beforeEach(() => {
        httpLoggerMiddleware.use(mockRequest, mockResponse, mockNext);
        jest.spyOn(httpLoggerMiddleware, 'getDurationInMilliseconds').mockReturnValueOnce(500);
      });

      it('should call response.on(Eevents.Finish)', () => {
        expect(mockResponse.on).toHaveBeenCalledWith(Eevents.Finish, expect.any(Function));
      });

      it('should log [FINISHED]', () => {
        expect(mockLoggerService.log).toHaveBeenCalledWith('GET /test [FINISHED] 1,000ms', { method: 'GET', url: '/test' });
      });
    });

    describe('[CLOSED]', () => {
      beforeEach(() => {
        httpLoggerMiddleware.use(mockRequest, mockResponse, mockNext);
        jest.spyOn(httpLoggerMiddleware, 'getDurationInMilliseconds').mockReturnValueOnce(500);
      });

      it('should call response.on(Eevents.Close)', () => {
        expect(mockResponse.on).toHaveBeenCalledWith(Eevents.Finish, expect.any(Function));
      });

      it('should log [FINISHED]', () => {
        expect(mockLoggerService.log).toHaveBeenCalledWith('GET /test [CLOSED] 1,000ms', { method: 'GET', url: '/test' });
      });
    });
  });
});
