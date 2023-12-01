import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { KEY as USE_CART_KEY } from '../useCart';

const KEY = '/action/cart/emptyCart';

const useEmptyCart = () => {
  const { trigger, error, isMutating } = useSWRMutation<unknown, Error, string, string[]>(
    KEY,
    (url, { arg }) => {
      return fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' });
    },
    {
      onSuccess: (data) => mutate(USE_CART_KEY, data, { revalidate: false }),
    },
  );

  return {
    trigger,
    error,
    isLoading: isMutating,
  };
};

export default useEmptyCart;
