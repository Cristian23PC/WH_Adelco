import { QueryParam } from '@commercetools/platform-sdk';

export interface IMethodArgs {
  queryArgs?: {
    [key: string]: QueryParam;
    expand?: string | string[];
  };
  headers?: {
    [key: string]: string | string[];
  };
}
