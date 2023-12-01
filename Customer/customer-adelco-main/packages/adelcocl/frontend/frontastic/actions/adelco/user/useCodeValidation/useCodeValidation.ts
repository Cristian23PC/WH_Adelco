import {
  CodeValidationPayload,
  CodeValidationResponse
} from '@Types/adelco/user';
import useSWRMutation from 'swr/mutation';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

const KEY = '/action/userAccount/validateCode';

const useCodeValidation = () => {
  const { trigger, isMutating, error } = useSWRMutation<
    CodeValidationResponse,
    Error,
    string,
    CodeValidationPayload
  >(KEY, (url, { arg }) =>
    fetchApiHub(url, { body: JSON.stringify(arg), method: 'POST' })
  );

  return {
    trigger,
    error,
    isLoading: isMutating
  };
};

export default useCodeValidation;
