import { EmailPassword } from '@Types/adelco/user';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { KEY as USE_SEARCH_PRODUCTS_KEY} from '../../products/useSearchProducts'
import { KEY as USE_USER_KEY } from '../useUser';

const KEY = '/action/userAccount/login';

const useLogin = () => {
  const { trigger, isMutating, error } = useSWRMutation<unknown, Error, string, EmailPassword>(
    KEY,
    (url, { arg }) => fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' }),
    {
      onSuccess: (data) => {
        mutate(USE_USER_KEY, data, { revalidate: false });
        mutate((key: string) => Array.isArray(key) && key[0] === USE_SEARCH_PRODUCTS_KEY);
      },
    },
  );

  return {
    trigger,
    error,
    isLoading: isMutating,
  };
};

export default useLogin;
