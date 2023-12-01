import { CodeResendPayload, CodeResendResponse } from '@Types/adelco/user';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { toast } from '@adelco/web-components';
import { AdelcoError } from '@Types/adelco/general';

const KEY = '/action/userAccount/resendCode';

const useCodeResend = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    CodeResendResponse,
    AdelcoError,
    string,
    CodeResendPayload
  >(KEY, (url, { arg }) =>
    fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' })
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useCodeResend;
