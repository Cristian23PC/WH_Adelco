import { EmailPassword } from '@Types/adelco/user';
import { mutate, useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { KEY as USE_SEARCH_PRODUCTS_KEY } from '../../products/useSearchProducts';
import { KEY as USE_DETAIL_PRODUCT_KEY } from '../../products/useDetailProduct';
import { KEY as USE_USER_KEY } from '../useUser';
import { KEY as CART_KEY } from '../../cart/useCart';
import useCart from 'frontastic/actions/adelco/cart/useCart';

const KEY = '/action/userAccount/login';

const useLogin = () => {
  const { cart } = useCart();
  const { cache } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<
    any,
    Error,
    string,
    EmailPassword
  >(
    KEY,
    (url, { arg }) =>
      fetchApiHub(url, {
        body: JSON.stringify({ ...arg, cartId: cart?.id }),
        method: 'POST'
      }),
    {
      onSuccess: (data) => {
        mutate(USE_USER_KEY, data, { revalidate: false });
        mutate(
          (key: string) =>
            Array.isArray(key) && key[0] === USE_SEARCH_PRODUCTS_KEY
        );
        mutate(
          (key: string) =>
            Array.isArray(key) && key[0] === USE_DETAIL_PRODUCT_KEY
        );

        if (data.cartMerged) cache.delete(CART_KEY);
      },
      onError: () => {
        throw new Error('Nombre de usuario o contraseña incorrecto');
      }
    }
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useLogin;
