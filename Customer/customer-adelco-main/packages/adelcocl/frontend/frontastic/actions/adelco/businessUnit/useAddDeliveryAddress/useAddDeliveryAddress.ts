import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { DeliveryAddressFormFormatedValues } from '@Types/adelco/businessUnits';

const KEY = '/action/businessUnits/addBusinessDeliveryAddress';

const useAddDeliveryAddress = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    KEY,
    (url, { arg }: { arg: DeliveryAddressFormFormatedValues }) =>
      fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' })
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useAddDeliveryAddress;
