import { HttpStatus } from '@nestjs/common';
import { IResponse } from '@/common/helpers/responses';

/**
 * Format error to use
 *
 * @param {EHttpStatus} statusCode
 * @param {string} message
 * @param {T} data
 * @param {boolean} proxyResponse
 * @param {number} total
 * @return {IResponse<T> | T}
 */
export const formatResponse = <T>(statusCode: HttpStatus, data: T, proxyResponse = false, message?: string, total?: number): IResponse<T> | T => {
  let response: IResponse<T> | T;
  if (proxyResponse) {
    response = data as unknown as IResponse<T>;
  } else {
    response = {
      statusCode,
      message,
      payload: data
    };
    if (total) response.count = total;
  }
  return response;
};
