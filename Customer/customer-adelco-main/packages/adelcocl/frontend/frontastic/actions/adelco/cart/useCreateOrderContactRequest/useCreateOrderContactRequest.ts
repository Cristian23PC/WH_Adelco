import { toast } from '@adelco/web-components';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import useSWRMutation from 'swr/mutation';

const KEY = '/action/anonymousCart/createOrderContactRequest';

const normalizeValues = ({ addresses, ...values }) => ({
  ...values,
  lastName: values.surname,
  address: {
    ...values.address,
    country: values.address.country || 'CL',
    city: values.address.locality,
    streetName: values.address.street,
    otherInformation: values.address.additionalInformation
  }
});

const useCreateOrderContactRequest = () =>
  useSWRMutation(
    KEY,
    (url, { arg }) =>
      fetchApiHub(url, {
        body: JSON.stringify(normalizeValues(arg)),
        method: 'POST'
      }),
    {
      onError: () =>
        toast.error({
          text: 'Se ha producido un error.',
          position: 'top-right'
        })
    }
  );

export default useCreateOrderContactRequest;
