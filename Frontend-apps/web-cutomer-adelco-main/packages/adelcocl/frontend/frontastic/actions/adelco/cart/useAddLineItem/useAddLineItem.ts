import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { KEY as USE_CART_KEY } from '../useCart';

const KEY = '/action/cart/addLineItem';

type LineItem = {
  sku: string;
  quantity: number;
};
const useAddLineItem = () => {
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

export default useAddLineItem;
