import { AxiosError } from 'axios';
import axios, { RequestData } from '../../utils/axiosInstance';
import {
  CodeResendPayload,
  CodeResendResponse,
  PreRegisterPayload,
  RegisterPayload,
  ValidationPayload,
  CodeValidationPayload,
  EmailPasswordCode,
  CodeValidationResponse
} from '@Types/adelco/user';

enum TRANSLATIONS {
  'User does not exist' = 'El usuario no existe'
}

export const preRegister = async (
  requestData: RequestData,
  user: PreRegisterPayload
) => {
  const { baseURL, headers } = requestData;
  try {
    const { data } = await axios.post(
      `${baseURL}/users/pre-registration`,
      user,
      {
        headers
      }
    );

    return data;
  } catch (error) {
    throw error as AxiosError;
  }
};

export const register = async (
  requestData: RequestData,
  user: RegisterPayload
) => {
  const { baseURL, headers } = requestData;
  try {
    const { data } = await axios.post(`${baseURL}/users/registration`, user, {
      validateStatus: (status) => status < 500,
      headers
    });

    return data;
  } catch (error) {
    throw (error as AxiosError).response.data;
  }
};

export const codeResend = async (
  requestData: RequestData,
  { username }: CodeResendPayload
): Promise<CodeResendResponse> => {
  try {
    const { baseURL, headers } = requestData;
    await axios.post(
      `${baseURL}/users/verification-code-request`,
      {
        username
      },
      { headers }
    );
    return {
      statusCode: 200,
      message: 'Success'
    };
  } catch (error) {
    const e = error as Error;
    throw {
      ...e,
      message: TRANSLATIONS[e.message] || e.message
    } as Error;
  }
};

export const validateVerificationCode = async (
  requestData: RequestData,
  payload: CodeValidationPayload
) => {
  try {
    const { baseURL, headers } = requestData;
    await axios.post(
      `${baseURL}/users/validate-verification-code-request`,
      payload,
      { headers }
    );
    return {
      statusCode: 200,
      message: 'Success'
    };
  } catch (error) {
    return error as CodeValidationResponse;
  }
};

export const resetPassword = async (
  requestData: RequestData,
  payload: EmailPasswordCode
): Promise<CodeResendResponse> => {
  try {
    const { baseURL, headers } = requestData;
    await axios.post(`${baseURL}/users/pass-reset-request`, payload, {
      headers
    });
    return {
      statusCode: 200,
      message: 'Success'
    };
  } catch (error) {
    throw (error as AxiosError).response.data;
  }
};

export const validation = async (
  requestData: RequestData,
  user: ValidationPayload
) => {
  const { baseURL, headers } = requestData;
  try {
    const { data } = await axios.post(`${baseURL}/users/validation`, user, {
      headers,
      validateStatus: (status) => status <= 400
    });

    return data;
  } catch (error) {
    throw error as AxiosError;
  }
};
