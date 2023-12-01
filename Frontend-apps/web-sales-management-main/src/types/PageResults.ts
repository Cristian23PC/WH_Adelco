export interface PageResults<T> {
  count: number;
  total: number;
  limit: number;
  offset: number;
  results: T[];
}
