import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UsersPageResult } from '@/types/User';
import { getUsersList } from '@/api/Users/Users';
import { toQueryParams } from '@/utils/Request';
import { toast } from '@adelco/web-components';

export const KEY = 'users';
const LIMIT = 10;

const useUsersList = () => {
  const [page, setPage] = useState<number>(1);
  const [text, setText] = useState<string | undefined>(undefined);

  const { data, isLoading, error } = useQuery<UsersPageResult>(
    [KEY, page, text],
    () =>
      getUsersList(
        toQueryParams({ offset: (page - 1) * LIMIT, limit: LIMIT, text })
      ),
    {
      staleTime: 1000 * 60 * 5,
      onError: (error: any) => {
        toast.error({ text: error.message, position: 'top-right' });
      }
    }
  );

  const totalPages = data?.total ? Math.ceil(data?.total / LIMIT) : 0;

  const handleSearch = (value: string) => {
    setPage(1);
    setText(value);
  };

  return {
    users: data,
    isLoading,
    error,
    page,
    setPage,
    search: handleSearch,
    totalPages
  };
};

export default useUsersList;
