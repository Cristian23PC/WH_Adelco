import useImmutableSWR from 'swr/immutable';
import { PaymentMethodResponse } from '@Types/adelco/cart';

export const KEY = '/action/cart/getPaymentMethods';

const usePaymentMethods = () => {
  const { data } = useImmutableSWR<PaymentMethodResponse | null>(KEY);

  return {
    data
  };
};

export default usePaymentMethods;
