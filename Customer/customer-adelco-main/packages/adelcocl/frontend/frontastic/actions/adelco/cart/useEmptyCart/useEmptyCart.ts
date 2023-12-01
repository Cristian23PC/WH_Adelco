import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import useUser from '../../user/useUser';
import useCart from '../useCart';

const KEY = '/action/cart/emptyCart';
const ANONYMOUS_KEY = '/action/anonymousCart/emptyCart';

const useEmptyCart = () => {
  const { isLoading, user } = useUser();
  const { mutateCart } = useCart();
  const cartKey = !isLoading && (!user.loggedIn ? ANONYMOUS_KEY : KEY);
  const { trigger, error, isMutating } = useSWRMutation<unknown, Error, string>(
    cartKey,
    (url, { arg }) => {
      return fetchApiHub(url, {
        body: JSON.stringify(arg),
        method: 'POST'
      });
    },
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

export default useEmptyCart;
