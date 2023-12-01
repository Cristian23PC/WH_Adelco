import { useState } from 'react';
import { getUsersList } from '@/api/Users/Users';
import { Role, User } from '@/types/User';
import { toQueryParams } from '@/utils/Request';
import { mapUserOptions } from '@/utils/mappers/users/users';
import { useQuery } from '@tanstack/react-query';

const KEY = 'users-by-role';

const useUsersByRole = (
  role: Role.SalesRep | Role.Supervisor | Role.ZoneManager | Role.GeneralManager
) => {
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery(
    [KEY, role, searchTerm],
    () => getUsersList(toQueryParams({ role, text: searchTerm, limit: 500 })),
    {
      /* select: (usersPageResult) => usersPageResult.results.map(mapUserOptions), */
      staleTime: 1000 * 60 * 5
    }
  );

  const getFullUser = (username: string) => {
    return data?.results.find((user) => user.username === username) as User;
  };

  return {
    users: data?.results.map(mapUserOptions),
    isLoading,
    onSearch: setSearchTerm,
    getFullUser
  };
};

export default useUsersByRole;
