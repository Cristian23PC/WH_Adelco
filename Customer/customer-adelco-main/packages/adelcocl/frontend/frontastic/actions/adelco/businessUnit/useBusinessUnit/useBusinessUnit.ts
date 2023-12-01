import {
  BusinessUnitPayload,
  CtBusinessUnit
} from '@Types/adelco/businessUnits';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { toast } from '@adelco/web-components';
import { useRouter } from 'next/router';

interface BusinessUnitResponse {
  status: number;
  body: CtBusinessUnit;
}

const KEY = '/action/businessUnits/updateBusinessUnitData';

const useBusinessUnit = () => {
  const router = useRouter();
  const {
    trigger,
    isMutating,
    error: errorUpdatingBusinessUnit
  } = useSWRMutation<BusinessUnitResponse, Error, string, BusinessUnitPayload>(
    KEY,
    (url, { arg }) =>
      fetchApiHub(url, { body: JSON.stringify(arg), method: 'PUT' }),
    {
      onError: () => {
        toast.error({
          title: 'Error',
          text: 'No ha sido posible crear correctamente la cuenta',
          position: 'top-right'
        });
        router.push('/');
      }
    }
  );

  return {
    trigger,
    errorUpdatingBusinessUnit,
    isUpdating: isMutating
  };
};

export default useBusinessUnit;
