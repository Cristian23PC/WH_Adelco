import { PageResults } from '@/types/PageResults';
import { toQueryParams } from '@/utils/Request';
import {
  QueryFunction,
  UseQueryOptions,
  useQuery,
  QueryKey,
  UseQueryResult
} from '@tanstack/react-query';
import { Dispatch, SetStateAction, useState } from 'react';

type UseQueryResultCustom<TData, TError> = UseQueryResult<TData, TError> & {
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchTerm: string;
};

const usePaginatedQuery = <
  TQueryFnData = unknown,
  TError = unknown,
  TData = PageResults<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey
>(
  queryKey: TQueryKey,
  queryFn: (queryParams: string) => Promise<TQueryFnData>,
  options?: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    'queryKey' | 'queryFn' | 'initialData'
  > & { initialData?: () => undefined; limit?: number }
): UseQueryResultCustom<TData, TError> => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const KEY = [...queryKey, page, searchTerm] as unknown as TQueryKey;
  const LIMIT = options?.limit || 25;

  const query = useQuery(
    KEY,
    () =>
      queryFn(
        toQueryParams({
          offset: (page - 1) * LIMIT,
          limit: LIMIT,
          text: searchTerm
        })
      ),
    options
  );

  const totalPages = (query.data as PageResults<TData>)?.total
    ? Math.ceil((query.data as PageResults<TData>).total / LIMIT)
    : 0;

  return {
    ...query,
    setPage,
    totalPages,
    searchTerm,
    setSearchTerm
  };
};

export default usePaginatedQuery;
