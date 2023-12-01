import { useState } from 'react';
import { getBranches } from '@/api/Branches/Branches';
import {
  Branch,
  BranchesPageResult,
  BranchesPageResultResponse
} from '@/types/Branch';
import { toQueryParams } from '@/utils/Request';
import { useQuery } from '@tanstack/react-query';
import { searchString } from '@/utils/utils';

export const KEY = 'branches';
const LIMIT = 10;

const DEFAULT_PARAMS = {
  limit: LIMIT
};

type GetBranchesParams = {
  limit?: number;
};

const useGetBranches = (params: GetBranchesParams = DEFAULT_PARAMS) => {
  const { limit } = { ...DEFAULT_PARAMS, ...params };

  const [page, setPage] = useState<number>(1);
  const [text, setText] = useState<string>('');

  const fetchData = async () => {
    try {
      const data = await getBranches(
        toQueryParams({ offset: (page - 1) * limit, limit })
      );
      const filteredData: Branch[] = data?.results.length
        ? data.results.filter((branch: Branch) =>
            searchString(branch.name, text)
          )
        : [];
      return { ...data, results: filteredData };
    } catch (error) {
      throw error;
    }
  };
  const { data, isLoading, error } = useQuery<
    BranchesPageResultResponse,
    Error,
    BranchesPageResult
  >([KEY, page, limit, text], () => fetchData(), {
    staleTime: 1000 * 60 * 5,
    onError: (error) => console.log(error)
  });

  const handleSearch = (value: string) => {
    setPage(1);
    setText(value);
  };

  return {
    branches: data?.results,
    query: text,
    search: handleSearch,
    isLoading,
    page,
    setPage,
    error,
    totalPages: data?.total ? Math.ceil(data?.total / limit) : 0
  };
};

export default useGetBranches;
