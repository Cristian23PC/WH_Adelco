export type PageResults<T> = {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: T[];
};
