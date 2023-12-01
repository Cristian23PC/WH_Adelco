import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Role, UsersPageResult } from '@/types/User';
import { getUsers } from '@/api/Users/Users';
import { toQueryParams } from '@/utils/Request';
import { Option } from '@/types/Option';
import { QueryOptions } from '@/types/UseQuery';

export const KEY = 'users';

type UserQueryParam = {
  role?: Role | undefined;
  text?: string;
  queryOptions?: QueryOptions<UsersPageResult, Error>;
};

const useUsers = ({ role, text, queryOptions = {} }: UserQueryParam) => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [usersOptions, setUserOptions] = useState<Option[]>([]);

  const { data, isLoading, error, fetchStatus } = useQuery<
    UsersPageResult,
    Error
  >(
    [KEY, role, text, page, limit],
    () =>
      getUsers(
        toQueryParams({ offset: (page - 1) * limit, limit, role, text })
      ),
    {
      staleTime: 1000 * 60 * 5,
      ...queryOptions
    }
  );

  const totalPages = data?.total ? Math.ceil(data?.total / limit) : 0;

  return {
    users: data?.results,
    total: data?.total,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    usersOptions,
    fetchStatus
  };
};

export default useUsers;
