import type { AxiosResponse } from 'axios';

import { EHttpStatus } from '../enums/http-status.enum';
import { IResponse } from './response.interface';

/**
 * @param {AxiosError} error
 * @returns {IResponse<T>}
 */
export const handleSuccess = <T>(
  response: AxiosResponse<IResponse<T>>
): IResponse<T> => {
  if (response.status === EHttpStatus.NoContent) {
    return {
      statusCode: EHttpStatus.NoContent,
    };
  }

  return {
    statusCode: response.status,
    payload: response.data.payload as T,
    data: response.data as T,
  };
};
