import { User } from '@Types/adelco/user';
import useImmutableSWR from 'swr/immutable';

export const KEY = `/action/userAccount/getUser`;

const useUser = (initUser?: User) => {
  const { data, error, isLoading } = useImmutableSWR<User>(KEY);

  return {
    user: data || initUser || {} as User,
    error,
    isLoading,
  };
};

export default useUser;
