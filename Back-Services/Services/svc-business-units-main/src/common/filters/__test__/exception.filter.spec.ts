import { HttpException, HttpStatus } from '@nestjs/common';
import { AllExceptionsFilter } from '../exception.filter';

const mockLoggerService = {
  error: jest.fn((exception: HttpException | Error) => exception)
};

jest.mock('@/common/utils/logger/logger.service', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

describe('AllExceptionsFilter', () => {
  let allExceptionsFilter: AllExceptionsFilter;

  beforeEach(() => {
    allExceptionsFilter = new AllExceptionsFilter();
  });

  describe('catch method', () => {
    let exception: HttpException | Error;
    let status: HttpStatus;
    let message: string;
    let response: {
      statusCode: HttpStatus.NOT_FOUND | HttpStatus.INTERNAL_SERVER_ERROR;
      message: string;
    };
    let mockResponse: {
      status: jest.Mock<any, any>;
    };
    const mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse
      })
    } as any;

    describe('should catch HttpException and return the correct response', () => {
      beforeEach(() => {
        status = HttpStatus.NOT_FOUND;
        message = 'Not Found';
        exception = new HttpException(message, status);
        response = {
          statusCode: status,
          message
        };
        mockResponse = {
          status: jest.fn().mockReturnValue({
            json: jest.fn().mockReturnValue(response)
          })
        };
        allExceptionsFilter.catch(exception, mockArgumentsHost);
      });

      it('status response should equal to HttpStatus.NOT_FOUND', () => {
        expect(mockResponse.status).toHaveBeenCalledWith(status);
      });

      it('should reply with a message and status code', () => {
        expect(mockResponse.status().json()).toEqual(response);
      });

      it('should call loggerService.error', () => {
        expect(mockLoggerService.error).toHaveBeenCalledWith(exception);
      });
    });

    describe('should catch unknown exception and return the default error', () => {
      beforeEach(() => {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Internal server error';
        exception = new Error('Something went wrong');
        response = {
          statusCode: status,
          message
        };
        mockResponse = {
          status: jest.fn().mockReturnValue({
            json: jest.fn().mockReturnValue(response)
          })
        };
        allExceptionsFilter.catch(exception, mockArgumentsHost);
      });

      it('status response should equal to HttpStatus.INTERNAL_SERVER_ERROR', () => {
        expect(mockResponse.status).toHaveBeenCalledWith(status);
      });

      it('should reply with a message and status code', () => {
        expect(mockResponse.status().json()).toEqual(response);
      });

      it('should call loggerService.error', () => {
        expect(mockLoggerService.error).toHaveBeenCalledWith(exception);
      });
    });
  });
});
