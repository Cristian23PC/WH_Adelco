import { CommercetoolsError } from '@/nest-commercetools/errors';
import { CommercetoolsExceptionFilter } from '../commercetools.exception.filter';

const mockLoggerService = {
  error: jest.fn((exception: Error) => exception)
};

jest.mock('@/common/utils/logger/logger.service', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

describe('CommercetoolsExceptionFilter', () => {
  let commercetoolsExceptionFilter: CommercetoolsExceptionFilter;

  beforeEach(() => {
    commercetoolsExceptionFilter = new CommercetoolsExceptionFilter();
  });

  describe('catch method', () => {
    let exception: CommercetoolsError;
    let status: number;
    let message: string;
    let response: {
      statusCode: number;
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

    describe('should catch error and return the correct response', () => {
      status = 400;
      message = 'error';
      exception = new CommercetoolsError({
        statusCode: 400,
        message: 'Malformed request'
      });
      response = {
        statusCode: status,
        message
      };
      mockResponse = {
        status: jest.fn().mockReturnValue({
          json: jest.fn().mockReturnValue(response)
        })
      };

      beforeEach(() => {
        commercetoolsExceptionFilter.catch(exception, mockArgumentsHost);
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

    describe('should catch nested errors and return the correct response', () => {
      status = 400;
      message = 'error';
      exception = new CommercetoolsError({
        statusCode: 400,
        body: {
          errors: [{ message: 'Malformed request' }]
        }
      });
      response = {
        statusCode: status,
        message
      };
      mockResponse = {
        status: jest.fn().mockReturnValue({
          json: jest.fn().mockReturnValue(response)
        })
      };

      beforeEach(() => {
        commercetoolsExceptionFilter.catch(exception, mockArgumentsHost);
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

    describe('should catch Not Found error and return the correct response', () => {
      status = 404;
      message = 'Not Found';
      exception = new CommercetoolsError({
        statusCode: 404,
        message: `The Resource with key 'key' was not found.`
      });
      response = {
        statusCode: status,
        message
      };
      mockResponse = {
        status: jest.fn().mockReturnValue({
          json: jest.fn().mockReturnValue(response)
        })
      };

      beforeEach(() => {
        commercetoolsExceptionFilter.catch(exception, mockArgumentsHost);
      });

      it('should status response equal to 404', () => {
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
