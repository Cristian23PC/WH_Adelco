import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import useCart from '../useCart';

const KEY = '/action/cart/removeCoupon';

type Coupon = {
  code: string;
};

const useRemoveCoupon = () => {
  const { mutateCart } = useCart();
  const { trigger, isMutating, error } = useSWRMutation<
    unknown,
    Error,
    string,
    Coupon
  >(
    KEY,
    (url, { arg }) =>
      fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' }),
    {
      onSuccess: mutateCart
    }
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useRemoveCoupon;
