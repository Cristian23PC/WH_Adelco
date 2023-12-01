import { QueryParam } from '@commercetools/platform-sdk';

export interface IQueryArgs {
  expand?: string | string[];
  [key: string]: QueryParam;
}
