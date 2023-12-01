import { ApiErrorFilter } from '../api.exception.filter';
import { ErrorBuilder } from '../../utils/error-builder/error-builder';
import { ApiError } from '../../errors/api.error';

const mockLoggerService = {
  error: jest.fn((exception: Error) => exception)
};

jest.mock('@/common/utils/logger/logger.service', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

describe('ApiErrorFilter', () => {
  let apiErrorFilter: ApiErrorFilter;

  beforeEach(() => {
    apiErrorFilter = new ApiErrorFilter();
  });

  describe('catch method', () => {
    let exception: ApiError;
    let status: number;
    let code: string;
    let message: string;
    let response: {
      statusCode: number;
      message: string;
      code?: string;
    };
    let mockResponse: {
      status: jest.Mock<any, any>;
    };
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse
      })
    } as any;

    describe('should catch invalid T2Zone for Distribution Channel and return the correct response', () => {
      status = 400;
      message = 't2zOverlapError';
      code = 'CAT-001';
      exception = ErrorBuilder.buildError(message);
      response = {
        statusCode: status,
        message,
        code
      };
      mockResponse = {
        status: jest.fn().mockReturnValue({
          json: jest.fn().mockReturnValue(response)
        })
      };

      beforeEach(() => {
        apiErrorFilter.catch(exception, mockArgumentsHost);
      });

      it('should status response equal to 400', () => {
        expect(mockResponse.status).toHaveBeenCalledWith(status);
      });

      it('should response with a message and status code', () => {
        expect(mockResponse.status().json()).toEqual(response);
      });

      it('should be called loggerService.error', () => {
        expect(mockLoggerService.error).toHaveBeenCalledWith(exception);
      });
    });

    describe('should catch default API error and return the correct response', () => {
      exception = ErrorBuilder.buildError({});
      status = 500;
      response = {
        statusCode: 500,
        message: 'Unexpected error'
      };
      mockResponse = {
        status: jest.fn().mockReturnValue({
          json: jest.fn().mockReturnValue(response)
        })
      };

      beforeEach(() => {
        apiErrorFilter.catch(exception, mockArgumentsHost);
      });

      it('should status response equal to 500', () => {
        expect(mockResponse.status).toHaveBeenCalledWith(status);
      });

      it('should response with a message and status code', () => {
        expect(mockResponse.status().json()).toEqual(response);
      });

      it('should be called loggerService.error', () => {
        expect(mockLoggerService.error).toHaveBeenCalledWith(exception);
      });
    });
  });
});
