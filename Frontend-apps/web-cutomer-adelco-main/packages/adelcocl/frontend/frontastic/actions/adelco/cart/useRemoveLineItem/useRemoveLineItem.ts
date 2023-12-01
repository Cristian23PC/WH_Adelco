import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { KEY as USE_CART_KEY } from '../useCart';

const KEY = '/action/cart/removeLineItem';

type LineItem = {
  id: string;
};
const useRemoveLineItem = () => {
  const { trigger, isMutating, error } = useSWRMutation<unknown, Error, string, LineItem>(
    KEY,
    (url, { arg }) => fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' }),
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

export default useRemoveLineItem;
