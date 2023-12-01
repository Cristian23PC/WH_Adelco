import { ZonePayload } from '@Types/adelco/user';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { KEY as USE_SEARCH_PRODUCTS_KEY } from '../../products/useSearchProducts';
import { KEY as USE_DETAIL_PRODUCT_KEY } from '../../products/useDetailProduct';
import { KEY as USE_USER_KEY } from '../useUser';
import { KEY as CART_KEY } from '../../cart/useCart';

const KEY = '/action/userAccount/setZone';

const useSetZone = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    unknown,
    Error,
    string,
    ZonePayload
  >(
    KEY,
    (url, { arg }) =>
      fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' }),
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
        mutate(CART_KEY);
      }
    }
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useSetZone;
