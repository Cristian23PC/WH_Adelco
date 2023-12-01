import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import useUser from '../../user/useUser';
import useCart from '../useCart';
import { useState } from 'react';

const KEY = '/action/cart/addLineItem';
const ANONYMOUS_KEY = '/action/anonymousCart/addLineItem';

type LineItem = {
  sku: string;
  quantity: number;
};
const useAddLineItem = () => {
  const [lastItem, setLastItem] = useState<null | LineItem>(null);
  const { isLoading, user } = useUser();
  const { mutateCart } = useCart();
  const cartKey = !isLoading && (!user.loggedIn ? ANONYMOUS_KEY : KEY);
  const { trigger, isMutating, error } = useSWRMutation<
    unknown,
    Error,
    string,
    LineItem
  >(
    cartKey,
    (url, { arg }) => {
      setLastItem(arg);
      return fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' });
    },
    {
      onSuccess: mutateCart
    }
  );

  return {
    trigger,
    error,
    isLoading: isMutating,
    lastItem
  };
};

export default useAddLineItem;
