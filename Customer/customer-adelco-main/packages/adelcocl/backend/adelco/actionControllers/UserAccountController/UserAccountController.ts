import {
  EmailPasswordCode,
  PreRegisterPayload,
  ValidationPayload,
  RegisterPayload,
  Zone,
  ZonePayload,
  CodeResendPayload,
  CodeResendResponse,
  CodeValidationPayload,
  CodeValidationResponse,
  EmailPasswordCart
} from '@Types/adelco/user';
import jwt from 'jwt-decode';
import { getAnonymousToken, getToken } from '../../apis/KeyCloakApi';
import {
  codeResend,
  validateVerificationCode,
  resetPassword as resetPasswordApi,
  preRegister,
  register,
  validation
} from '../../apis/CustomerApi';
import { Request, Response, ActionContext } from '@frontastic/extension-types';
import { formatZoneLabel } from '../../utils/mappers/businessUnit';
import {
  mapBussinessUnits,
  mapShippingAddresses
} from '../../utils/mappers/customer';
import ERROR_MESSAGES from '../../utils/mappers/errorMessages';
import { getDataFromContext } from '../../utils/axiosInstance';
import { AxiosErrorData } from '@Types/adelco/general/AdelcoError';
import { getUserBusinessUnits } from '../../apis/BusinessUnitApi';
import { mergeAnonymousCart } from '../cartController';

const getUserAccountFromSession = (request: Request): Zone | undefined => {
  return request.sessionData?.userAccount;
};

export const preRegisterUser = async (
  request: Request,
  context: ActionContext
) => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );
  const body = JSON.parse(request.body) as PreRegisterPayload;
  try {
    const user = await preRegister(requestData, body);

    return {
      status: 200,
      body: user
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode || 500,
      body: JSON.stringify({ error: e })
    };
  }
};

export const registerUser = async (
  request: Request,
  context: ActionContext
) => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );
  try {
    const body = JSON.parse(request.body) as RegisterPayload;
    const user = await register(requestData, body);

    return {
      status: 200,
      body: user
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode || 500,
      body: JSON.stringify({ error: e })
    };
  }
};

export const resendCode = async (
  request: Request,
  context: ActionContext
): Promise<CodeResendResponse | Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'businessUnit'
    );
    const body = JSON.parse(request.body) as CodeResendPayload;
    const response = await codeResend(requestData, body);

    return response;
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode || 500,
      body: JSON.stringify({ error: e })
    };
  }
};

export const validateCode = async (
  request: Request,
  context: ActionContext
): Promise<CodeValidationResponse> => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );
  const body = JSON.parse(request.body) as CodeValidationPayload;
  return await validateVerificationCode(requestData, body);
};

export const resetPassword = async (
  request: Request,
  context: ActionContext
) => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );
  const body = JSON.parse(request.body) as EmailPasswordCode;
  return resetPasswordApi(requestData, body);
};

export const validationUser = async (
  request: Request,
  context: ActionContext
) => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );
  const body = JSON.parse(request.body) as ValidationPayload;

  try {
    const user = await validation(requestData, body);

    return {
      status: 200,
      body: user
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode || 500,
      body: JSON.stringify({ error: e })
    };
  }
};

export const getUserAccount = (request: Request): Response => {
  const userAccount = getUserAccountFromSession(request);

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount || {})
  };
};

export const setZone = (request: Request): Response => {
  const {
    zoneId,
    dch,
    t2z,
    minAmount,
    communeLabel,
    regionLabel,
    deliveryZoneLabel,
    businessUnitId
  } = JSON.parse(request.body) as ZonePayload;
  const userAccountSession = getUserAccountFromSession(request);
  const zoneLabel = formatZoneLabel({
    communeLabel,
    regionLabel,
    deliveryZoneLabel
  });
  const userAccount = {
    ...userAccountSession,
    zoneId,
    dch,
    t2z,
    minAmount,
    zoneLabel,
    businessUnitId
  };

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount),
    sessionData: {
      ...request.sessionData,
      userAccount
    }
  };
};

type KeycloakUser = {
  name: string;
  preferred_username: string;
  email: string;
};

export const login = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  const requestData = await getDataFromContext(
    { ...context, request },
    'businessUnit'
  );

  const keycloakConfig =
    context.frontasticContext?.project.configuration.keycloak;
  const { password, username, cartId } = JSON.parse(
    request.body
  ) as EmailPasswordCart;
  const tokenResponse = await getToken({ username, password }, keycloakConfig);

  if (tokenResponse.error) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        name: 'Error de inicio de session',
        message:
          ERROR_MESSAGES[tokenResponse['error_description']] ||
          'Error Interno del Servidor',
        error: true
      })
    };
  }

  requestData.headers.Authorization = `Bearer ${tokenResponse.access_token}`;
  requestData.headers.refresh_token = tokenResponse.refresh_token;

  const { data: businessUnits } = await getUserBusinessUnits(requestData);
  const userdata: KeycloakUser = jwt(tokenResponse.access_token);

  const userAccountSession = getUserAccountFromSession(request);
  const zone = mapBussinessUnits(businessUnits);
  let cartMerged = false;

  if (cartId && zone?.businessUnitId) {
    const cartRequest = {
      ...request,
      sessionData: {
        ...request.sessionData,
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token
      },
      body: JSON.stringify({ businessUnitId: zone?.businessUnitId, cartId })
    };

    const mergedCarts = await mergeAnonymousCart(cartRequest, context);

    cartMerged = mergedCarts.statusCode === 200;
  }

  const userAccount = {
    ...userAccountSession,
    zoneId: zone?.id,
    dch: zone?.dch,
    t2z: zone?.t2z,
    minAmount: zone?.minAmount,
    businessUnitId: zone?.businessUnitId,
    zoneLabel: zone?.zoneLabel,
    useT2Rate: zone?.useT2Rate,
    taxProfile: zone?.taxProfile,
    loggedIn: true,
    username: userdata?.name || userdata?.preferred_username,
    email: userdata?.email,
    incompleteRegistration:
      businessUnits?.businessUnits?.[0].status === 'Inactive',
    cartMerged
  };

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount),
    sessionData: {
      ...request.sessionData,
      ...(tokenResponse?.access_token && {
        access_token: tokenResponse.access_token,
        refresh_token: tokenResponse.refresh_token
      }),
      userAccount
    }
  };
};

export const logout = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const userAccount = { loggedIn: false };
    const { access_token, refresh_token } = await getAnonymousToken(
      context?.frontasticContext?.project.configuration.keycloak
    );
    return {
      statusCode: 200,
      body: JSON.stringify(userAccount),
      sessionData: {
        ...request.sessionData,
        access_token,
        refresh_token,
        userAccount
      }
    };
  } catch (e) {
    return {
      statusCode: (e as AxiosErrorData).statusCode,
      body: JSON.stringify({ error: e })
    };
  }
};

export const getUser = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  const userAccount = getUserAccountFromSession(request) || null;

  let access_token = request.sessionData?.access_token;
  let refresh_token = request.sessionData?.refresh_token;
  if (!access_token || !refresh_token) {
    const anonymousToken = await getAnonymousToken(
      context.frontasticContext?.project.configuration.keycloak
    );
    access_token = anonymousToken.access_token;
    refresh_token = anonymousToken.refresh_token;
  }

  return {
    statusCode: 200,
    body: JSON.stringify(userAccount),
    sessionData: {
      ...request.sessionData,
      access_token,
      refresh_token
    }
  };
};

export const getShippingAddresses = async (
  request: Request,
  context: ActionContext
): Promise<Response> => {
  try {
    const requestData = await getDataFromContext(
      { ...context, request },
      'businessUnit'
    );
    const { data: businessUnits } = await getUserBusinessUnits(requestData);
    const addresses = mapShippingAddresses(businessUnits);

    return {
      statusCode: 200,
      body: JSON.stringify(addresses),
      sessionData: {
        ...request.sessionData,
        access_token: requestData.headers.Authorization.replace('Bearer ', ''),
        refresh_token: requestData.headers.refresh_token
      }
    };
  } catch (error) {
    return {
      statusCode: (error as AxiosErrorData).statusCode,
      body: JSON.stringify({ error })
    };
  }
};
