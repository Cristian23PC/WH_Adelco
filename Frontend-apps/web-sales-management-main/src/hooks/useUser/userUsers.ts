import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Role, UsersPageResult } from '@/types/User';
import { getUsers } from '@/api/Users/Users';
import { toQueryParams } from '@/utils/Request';

export const KEY = 'users';

type UserQueryParam = {
  role?: Role;
  text?: string;
};

const useUsers = ({ role, text }: UserQueryParam) => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);

  const { data, isLoading, error } = useQuery<UsersPageResult, Error>(
    [KEY, role, text, page, limit],
    () =>
      getUsers(
        toQueryParams({ offset: (page - 1) * limit, limit, role, text })
      ),
    {
      staleTime: 1000 * 60 * 5
    }
  );

  const totalPages = data?.total ? Math.ceil(data?.total / limit) : 0;

  return {
    users: data?.results,
    isLoading,
    error,
    page,
    setPage,
    totalPages
  };
};

export default useUsers;
