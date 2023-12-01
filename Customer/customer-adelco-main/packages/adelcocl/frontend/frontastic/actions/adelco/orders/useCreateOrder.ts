import { AdelcoError } from '@Types/adelco/general';
import { toast } from '@adelco/web-components';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import useSWRMutation from 'swr/mutation';
import useCart from '../cart/useCart';

const KEY = '/action/order/convertActiveCartInOrder';

interface OrderPayload {
  paymentMethod: string;
  customerComment?: string;
  source: 'ecomm' | 'sales';
}

const useCreateOrder = () => {
  const { removeCartFromCache } = useCart();
  const { trigger, isMutating, error } = useSWRMutation<
    unknown,
    AdelcoError,
    string,
    OrderPayload
  >(
    KEY,
    (url, { arg }) => {
      return fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' });
    },
    {
      onSuccess: removeCartFromCache,
      onError: () => {
        toast.error({
          iconName: 'error',
          title: 'No fue posible crear el pedido',
          text: 'Vuelve a intentarlo',
          position: 'top-right'
        });
      }
    }
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useCreateOrder;
