import { CodeResendResponse, EmailPasswordCode } from '@Types/adelco/user';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

const KEY = '/action/userAccount/resetPassword';

const useResetPassword = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    CodeResendResponse,
    Error,
    string,
    EmailPasswordCode
  >(KEY, (url, { arg }) =>
    fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' })
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useResetPassword;
