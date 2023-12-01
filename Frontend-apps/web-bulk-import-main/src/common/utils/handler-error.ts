import type { AxiosError } from 'axios';

import { EHttpStatus } from '../enums/http-status.enum';
import type { IResponse } from './response.interface';

/**
 * @param {AxiosError} error
 * @returns {IResponse<T>}
 */
export const handlerError = <T>(error: AxiosError): IResponse<T> => {
  const defaultResponse: IResponse<T> = {
    statusCode: EHttpStatus.InvalidRequest,
  };

  switch (error.response!.status) {
    case EHttpStatus.Unauthorized:
    default:
      break;
  }
  if (!error.response?.data) {
    return defaultResponse;
  }
  return error.response?.data as IResponse<T>;
};
