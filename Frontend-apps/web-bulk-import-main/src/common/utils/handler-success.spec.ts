/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosResponse } from 'axios';
import { EHttpStatus } from '../enums/http-status.enum';
import { handleSuccess } from './handler-success';
import { IResponse } from './response.interface';

describe('handleSuccess', () => {
  it('returns correct response when status is NoContent', () => {
    const response: AxiosResponse<IResponse<number>> = {
      status: EHttpStatus.NoContent,
      data: { payload: 50, statusCode: EHttpStatus.NoContent },
      statusText: 'dsds',
      config: { headers: {} as any },
      headers: {},
    };

    const result = handleSuccess(response);

    expect(result).toEqual({
      statusCode: EHttpStatus.NoContent,
    });
  });

  it('returns correct response when status is not NoContent', () => {
    const responseData: IResponse<any> = {
      statusCode: EHttpStatus.Success,
      payload: 50,
      data: { payload: 50, statusCode: EHttpStatus.Success },
    };
    const response: AxiosResponse<IResponse<number>> = {
      status: EHttpStatus.Success,
      data: { payload: 50, statusCode: EHttpStatus.Success },
      statusText: 'dsds',
      config: { headers: {} as any },
      headers: {},
    };

    const result = handleSuccess(response);

    expect(result).toEqual(responseData);
  });
});
