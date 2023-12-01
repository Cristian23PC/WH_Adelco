import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import {
  KEY as USE_CART_KEY,
  ANONYMOUS_KEY as USE_ANONYMOUS_CART_KEY
} from '../useCart';

const KEY = '/action/cart/removeLineItem';
const ANONYMOUS_KEY = '/action/anonymousCart/removeLineItem';

type LineItem = {
  id: string;
};
const useRemoveLineItem = ({ isAnonymous } = { isAnonymous: false }) => {
  const cartKey = isAnonymous ? ANONYMOUS_KEY : KEY;
  const mutationKey = isAnonymous ? USE_ANONYMOUS_CART_KEY : USE_CART_KEY;
  const { trigger, isMutating, error } = useSWRMutation<
    unknown,
    Error,
    string,
    LineItem
  >(
    cartKey,
    (url, { arg }) =>
      fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' }),
    {
      onSuccess: (data) => mutate(mutationKey, data, { revalidate: false })
    }
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useRemoveLineItem;
