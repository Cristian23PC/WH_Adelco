import { HttpStatus } from '@nestjs/common';

export interface IResponse<T> {
  statusCode: HttpStatus;
  code?: string;
  message: string;
  payload?: T;
  count?: number;
  meta?: { [k: string]: unknown };
  errors?: Array<string> | string | Record<string, unknown> | Array<Record<string, unknown>>;
}
