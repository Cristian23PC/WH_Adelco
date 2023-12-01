import { QueryParam } from '@commercetools/platform-sdk';

export type queryArgsCt = {
  expand?: string | string[];
  sort?: string | string[];
  limit?: number;
  offset?: number;
  withTotal?: boolean;
  where?: string | string[];
  [key: string]: QueryParam;
};
