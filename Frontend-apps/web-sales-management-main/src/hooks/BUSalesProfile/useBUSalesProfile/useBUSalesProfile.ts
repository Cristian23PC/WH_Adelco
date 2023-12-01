import { useState } from 'react';
import { getBUSalesProfiles } from '@/api/BUSalesProfile';
import {
  BUSalesProfilePageResultResponse,
  BUSalesProfilePageResult
} from '@/types/BUSalesProfile';
import { mapBUSalesProfile } from '@/utils/mappers/buSalesProfile/buSalesProfile';
import { useQuery } from '@tanstack/react-query';
import { toQueryParams } from '@/utils/Request';
import { toast } from '@adelco/web-components';
import { QueryOptions } from '@/types/UseQuery';

export const KEY = 'bu sales profile';

type BUSalesProfileParams = QueryOptions<
  BUSalesProfilePageResultResponse,
  Error,
  BUSalesProfilePageResult
>;

const useBUSalesProfile = (queryOptions: BUSalesProfileParams = {}) => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [text, setText] = useState<string | undefined>(undefined);
  const [unassignedOnly, setUnassignedOnly] = useState<boolean>(false);

  const { data, isLoading, error, fetchStatus } = useQuery<
    BUSalesProfilePageResultResponse,
    Error,
    BUSalesProfilePageResult
  >(
    [KEY, page, limit, text, unassignedOnly],
    () =>
      getBUSalesProfiles(
        toQueryParams({
          offset: (page - 1) * limit,
          limit,
          text,
          unassignedOnly
        })
      ),
    {
      select: ({ results, ...data }) => ({
        ...data,
        results: results.map(mapBUSalesProfile)
      }),
      staleTime: 1000 * 60 * 5,
      onError: (error: any) =>
        toast.error({ text: error.message, position: 'top-right' }),
      ...queryOptions
    }
  );

  const toggleUnassignedOnly = () => {
    setPage(1);
    setUnassignedOnly(!unassignedOnly);
  };

  const totalPages = data?.total ? Math.ceil(data?.total / limit) : 0;

  const handleSearch = (value: string) => {
    setPage(1);
    setText(value);
  };

  return {
    buSalesProfiles: data,
    isLoading,
    error,
    page,
    setPage,
    search: handleSearch,
    totalPages,
    fetchStatus,
    unassignedOnly,
    toggleUnassignedOnly
  };
};

export default useBUSalesProfile;
