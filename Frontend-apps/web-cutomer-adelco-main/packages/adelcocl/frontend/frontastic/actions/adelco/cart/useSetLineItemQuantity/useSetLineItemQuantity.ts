import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { KEY as USE_CART_KEY } from '../useCart';

const KEY = '/action/cart/setLineItemQuantity';

type LineItem = {
  id: string;
  quantity: number;
};
const useSetLineItemQuantity = () => {
  const { trigger, error, isMutating } = useSWRMutation<unknown, Error, string, LineItem>(
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

export default useSetLineItemQuantity;
