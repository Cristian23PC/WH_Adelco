import { init } from '@/api/Keycloak';
import { getRegisteredUser } from '@/api/Users';
import { useQuery } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';

const KEY = 'authentication';
const KEY_EXTRA = 'extra-authentication';

const useAuthentication = () => {
  const router = useRouter();
  const pathname = usePathname();

  const response = useQuery([KEY], init, {
    onSuccess: (data) => {
      if (data.isError && pathname !== '/') {
        router.push('/');
      } else if (!data.isError && pathname === '/') {
        router.push('/dashboard');
      }
    },
    staleTime: Infinity
  });

  const isAdditionalInfoNeeded =
    response.isSuccess &&
    !response.data?.isError &&
    response.data?.role !== 'admin';

  const additionalResponse = useQuery([KEY_EXTRA], getRegisteredUser, {
    select: (data) => {
      return response.data
        ? {
            ...response.data,
            phone: data.phone,
            role: data.role
          }
        : undefined;
    },
    enabled: isAdditionalInfoNeeded,
    retry: 2,
    staleTime: Infinity
  });

  if (isAdditionalInfoNeeded && additionalResponse.data) {
    return additionalResponse;
  }

  return response;
};

export default useAuthentication;
