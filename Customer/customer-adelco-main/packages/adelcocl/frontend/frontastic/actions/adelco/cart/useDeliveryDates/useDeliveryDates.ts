import { DeliveryDatesResponse } from '@Types/adelco/cart';
import useImmutableSWR from 'swr/immutable';

export const KEY = '/action/cart/getDeliveryDates';

const useDeliveryDates = () => {
  const { data } = useImmutableSWR<DeliveryDatesResponse>(KEY);

  return {
    deliveryDates: data?.deliveryDates || []
  };
};

export default useDeliveryDates;
