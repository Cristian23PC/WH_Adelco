/* eslint-disable @typescript-eslint/no-explicit-any */
import { handlerError } from './handler-error';
import { EHttpStatus } from '../enums/http-status.enum';
import { IResponse } from './response.interface';
import { AxiosError } from 'axios';

describe('handlerError', () => {
  it('returns default response when error has no response', () => {
    const error = { response: { status: 500 } } as AxiosError<unknown, any>;
    const defaultResponse: IResponse<unknown> = {
      statusCode: EHttpStatus.InvalidRequest,
    };

    const result = handlerError(error);

    expect(result).toEqual(defaultResponse);
  });

  it('returns default response when error has no data in the response', () => {
    const error = {
      response: {
        status: EHttpStatus.Unauthorized,
        data: undefined,
      },
    } as AxiosError<unknown, any>;
    const defaultResponse: IResponse<unknown> = {
      statusCode: EHttpStatus.InvalidRequest,
    };

    const result = handlerError(error);

    expect(result).toEqual(defaultResponse);
  });

  it('returns response data when error has data in the response', () => {
    const responseData: IResponse<string> = {
      statusCode: EHttpStatus.Success,
      data: 'Some data',
    };
    const error = {
      response: {
        status: EHttpStatus.Unauthorized,
        data: responseData,
      },
    } as AxiosError<unknown, any>;

    const result = handlerError(error);

    expect(result).toEqual(responseData);
  });
});
