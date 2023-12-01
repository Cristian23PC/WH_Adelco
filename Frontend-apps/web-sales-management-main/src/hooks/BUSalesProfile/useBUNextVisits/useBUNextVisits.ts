import { useState } from 'react';
import { getBUNextVisits } from '@/api/BUSalesProfile';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@adelco/web-components';
import { toQueryParams } from '@/utils/Request';
import { NextVisitPageResult } from '@/types/BUSalesProfile';

const KEY = 'next visits';

const useBUNextVisits = () => {
  const [page] = useState<number>(1);
  const [limit] = useState<number>(500);
  const [time, setTime] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useQuery<
    NextVisitPageResult,
    Error,
    NextVisitPageResult
  >(
    [KEY, page, limit, time],
    () =>
      getBUNextVisits(
        toQueryParams({
          offset: (page - 1) * limit,
          limit,
          time,
          includedNotVisited: true
        })
      ),
    {
      onError: (error: any) =>
        toast.error({ text: error.message, position: 'top-right' })
    }
  );

  return {
    nextVisits: data,
    isLoading,
    error,
    setTime
  };
};

export default useBUNextVisits;
