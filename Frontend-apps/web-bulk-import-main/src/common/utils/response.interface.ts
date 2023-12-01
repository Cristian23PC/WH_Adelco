import type { EHttpStatus } from '../enums/http-status.enum';

export interface IResponse<T> {
  statusCode: EHttpStatus;
  payload?: T;
  data?: T;
}
