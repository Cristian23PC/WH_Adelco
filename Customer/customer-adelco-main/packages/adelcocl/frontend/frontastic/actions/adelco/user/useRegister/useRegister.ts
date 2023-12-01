import { CtBusinessUnit } from '@Types/adelco/businessUnits';
import { RegisterPayload } from '@Types/adelco/user';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { toast } from '@adelco/web-components';

interface ResponseBody extends CtBusinessUnit {
  statusCode: number;
  code: string;
  data: {
    remainingAttempts: number;
  };
}
interface RegisterResponse {
  status: number;
  body: ResponseBody;
}

const KEY = '/action/userAccount/registerUser';

const useRegister = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    RegisterResponse,
    Error,
    string,
    RegisterPayload
  >(
    KEY,
    (url, { arg }) =>
      fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' }),
    {
      onError: () => {
        toast.error({
          position: 'top-right',
          title: 'Error',
          text: 'Ocurrió un error al validar el código.<br/>Por favor, vuelve a solicitar un código de verificación.'
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

export default useRegister;
