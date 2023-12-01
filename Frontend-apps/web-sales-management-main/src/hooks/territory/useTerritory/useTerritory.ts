import { useState } from 'react';
import { getTerritories } from '@/api/Territory';
import {
  TerritoriesPageResultResponse,
  TerritoriesPageResult
} from '@/types/Territory';
import { useQuery } from '@tanstack/react-query';
import { toQueryParams } from '@/utils/Request';
import { toast } from '@adelco/web-components';
import { QueryOptions } from '@/types/UseQuery';

export const KEY = 'territory';

type TerritoryParams = QueryOptions<
  TerritoriesPageResultResponse,
  Error,
  TerritoriesPageResult
>;

const useTerritory = (queryOptions: TerritoryParams = {}) => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [text, setText] = useState<string>('');

  const { data, isLoading, error, fetchStatus } = useQuery<
    TerritoriesPageResultResponse,
    Error,
    TerritoriesPageResult
  >(
    [KEY, page, limit, text],
    () =>
      getTerritories(
        toQueryParams({ offset: (page - 1) * limit, limit, text })
      ),
    {
      staleTime: 1000 * 60 * 5,
      onError: (error: any) =>
        toast.error({ text: error.message, position: 'top-right' }),
      ...queryOptions
    }
  );

  const totalPages = data?.total ? Math.ceil(data?.total / limit) : 0;

  const handleSearch = (value: string) => {
    setPage(1);
    setText(value);
  };

  return {
    territories: data,
    isLoading,
    error,
    page,
    setPage,
    query: text,
    search: handleSearch,
    totalPages,
    fetchStatus
  };
};

export default useTerritory;
