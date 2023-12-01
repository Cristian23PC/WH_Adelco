import { useEffect, useState } from 'react';
import { getSupervisedAreas } from '@/api/SupervisedArea';
import {
  SupervisedAreasPageResultResponse,
  SupervisedAreasPageResult,
  SupervisedArea
} from '@/types/SupervisedAreas';
import { toQueryParams } from '@/utils/Request';
import { mapSupervisedArea } from '@/utils/mappers/supervisedAreas/supervisedArea';
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';
import { searchString } from '@/utils/utils';
import { QueryOptions } from '@/types/UseQuery';

export const KEY = 'supervised areas';
const LIMIT = 10;

const DEFAULT_PARAMS = {
  limit: LIMIT
};

type SupervisedAreasProps = {
  limit?: number;
};

const useSupervisedAreas = (
  params: SupervisedAreasProps = DEFAULT_PARAMS,
  queryOptions: QueryOptions<
    SupervisedAreasPageResultResponse,
    Error,
    SupervisedAreasPageResult
  > = {}
) => {
  const { limit } = { ...DEFAULT_PARAMS, ...params };

  const [page, setPage] = useState<number>(1);
  const [text, setText] = useState<string>('');
  const [supervisedAreasFiltered, setSupervisedAreasFiltered] = useState<
    SupervisedArea[]
  >([]);
  const { data, isLoading, error, fetchStatus } = useQuery<
    SupervisedAreasPageResultResponse,
    Error,
    SupervisedAreasPageResult
  >(
    [KEY, page, limit],
    () =>
      getSupervisedAreas(toQueryParams({ offset: (page - 1) * limit, limit })),
    {
      select: ({ results, ...data }) => ({
        ...data,
        results: results.map(mapSupervisedArea)
      }),
      staleTime: 1000 * 60 * 5,
      onError: (error) => console.log(error),
      ...queryOptions
    }
  );

  useEffect(() => {
    if (data?.results) {
      const newSupervisedAreasFilteredValue = data?.results.filter(
        (supervisedArea) => searchString(supervisedArea.name, text)
      );
      setSupervisedAreasFiltered(newSupervisedAreasFilteredValue);
    }
  }, [data, text]);

  const handleSearch = (value: string) => {
    setPage(1);
    setText(value);
  };

  return {
    supervisedAreas: data,
    supervisedAreasFiltered: { results: supervisedAreasFiltered },
    isLoading,
    page,
    setPage,
    error,
    query: text,
    search: handleSearch,
    totalPages: data?.total ? Math.ceil(data?.total / LIMIT) : 0,
    fetchStatus
  };
};

export default useSupervisedAreas;
