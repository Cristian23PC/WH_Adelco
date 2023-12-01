import { Cart, LineItem } from '@Types/adelco/cart';
import { mutate } from 'swr';
import useImmutableSWR from 'swr/immutable';
import { fetchApiHub } from 'frontastic';
import useUser from '../../user/useUser';

export const KEY = '/action/cart/getCart';
export const ANONYMOUS_KEY = '/action/anonymousCart/getCart';

const useCart = () => {
  const { isLoading, user } = useUser();
  const cartKey = !isLoading && (!user.loggedIn ? ANONYMOUS_KEY : KEY);
  const { data: cart } = useImmutableSWR<Cart | null>(cartKey, fetchApiHub, {
    onError: () => mutate(cartKey, { lineItems: [] }, { revalidate: false })
  });

  const removeCartFromCache = () =>
    mutate(cartKey, { lineItems: [] }, { revalidate: false });

  const getCartItem = (id: string): LineItem => {
    return cart?.lineItems?.find((item) => item.productId === id);
  };

  const mutateCart = (data: Cart) =>
    mutate(cartKey, data, { revalidate: false });

  return {
    cart,
    getCartItem,
    mutateCart,
    removeCartFromCache
  };
};

export default useCart;
