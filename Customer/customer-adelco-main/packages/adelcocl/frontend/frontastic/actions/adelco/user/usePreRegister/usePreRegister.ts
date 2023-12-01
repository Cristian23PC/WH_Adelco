import { PreRegisterPayload } from '@Types/adelco/user';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { toast } from '@adelco/web-components';

interface PreRegisterResponse {
  status: number;
  body: {
    code: string;
  };
}

const KEY = '/action/userAccount/preRegisterUser';

const usePreRegister = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    PreRegisterResponse,
    Error,
    string,
    PreRegisterPayload
  >(
    KEY,
    (url, { arg }) =>
      fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' }),
    {
      onError: () => {
        toast.error({
          position: 'top-right',
          title: 'Error',
          text: 'Error al crear el usuario'
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

export default usePreRegister;
