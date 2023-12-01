import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { AddressZone } from '@Types/adelco/businessUnits';

const KEY = '/action/userAccount/getShippingAddresses';

const useShippingAddress = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    AddressZone[],
    Error,
    string,
    string
  >(KEY, (url) =>
    fetchApiHub(url, {
      method: 'POST'
    })
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useShippingAddress;
