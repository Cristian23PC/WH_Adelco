import { ValidationPayload } from '@Types/adelco/user';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { toast } from '@adelco/web-components';

interface ValidationResponse {
  status: number;
  body: {
    buName: string;
    statusCode: number;
    code: string;
  };
  message: string;
}

const KEY = '/action/userAccount/validationUser';

const useValidation = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    ValidationResponse,
    Error,
    string,
    ValidationPayload
  >(
    KEY,
    (url, { arg }) =>
      fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' }),
    {
      onError: () => {
        toast.error({
          position: 'top-right',
          title: 'Error',
          text: 'Ocurrió un error al validar el usuario.<br/>Por favor inténtelo más tarde.'
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

export default useValidation;
