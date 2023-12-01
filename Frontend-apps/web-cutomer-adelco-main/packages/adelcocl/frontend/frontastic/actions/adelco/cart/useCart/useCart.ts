import { Cart, LineItem } from '@Types/adelco/Cart';
import useImmutableSWR from 'swr/immutable';
import { fetchApiHub } from 'frontastic';

export const KEY = '/action/cart/getCart';

const useCart = () => {
  const { data: cart } = useImmutableSWR<Cart | null>(KEY, fetchApiHub);

  const getCartItem = (id: string): LineItem => {
    return cart?.lineItems?.find((item) => item.productId === id);
  };

  return {
    cart,
    getCartItem,
  };
};

export default useCart;
