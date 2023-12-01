import { DataSourceContext } from '@frontastic/extension-types';
import { getAnonymousToken, getRefreshToken } from '../apis/KeyCloakApi';
import axios, { AxiosError } from 'axios';
import jwtDecode from 'jwt-decode';

const interceptor = async (error: AxiosError) => {
  const { data, status, config } = error.response || {};

  if (error.response.status === 401) {
    const { refresh_token } = config.headers;
    const { iss: keycloakURL, azp: keycloakClientId } = jwtDecode<{
      iss: string;
      azp: string;
    }>(refresh_token);
    try {
      const refreshResponse = await getRefreshToken(
        keycloakURL,
        keycloakClientId,
        refresh_token
      );

      const response = await axios({
        ...config,
        headers: {
          ...config.headers,
          Authorization: `Bearer ${refreshResponse.access_token}`,
          refresh_token: refreshResponse.refresh_token
        }
      });

      return Promise.resolve({
        ...response,
        access_token: refreshResponse.access_token,
        refresh_token: refreshResponse.refresh_token
      });
    } catch (e) {
      return Promise.reject({
        statusCode: 400,
        message: 'Refresh token inválido o expirado',
        expiredRefresh: true
      });
    }
  }

  return Promise.reject({
    statusCode: status,
    ...data
  });
};

axios.interceptors.response.use(async (response) => {
  const { Authorization, refresh_token } = response.config.headers;
  return {
    ...response,
    sessionData: {
      access_token: Authorization?.replace('Bearer ', ''),
      refresh_token: refresh_token
    }
  };
}, interceptor);

export interface RequestData {
  baseURL: string;
  headers: {
    Authorization: string;
    refresh_token: string;
  };
}
type MsName = 'product' | 'businessUnit' | 'cart' | 'orders';
export const getDataFromContext = async (
  context: DataSourceContext,
  msName: MsName
): Promise<RequestData> => {
  const keycloakConfig =
    context?.frontasticContext?.project?.configuration?.keycloak;
  let token = context.request?.sessionData?.access_token;
  let refresh_token = context.request?.sessionData?.refresh_token;
  let isTokenExpired = false;
  let isAnonymousToken = true;

  if (refresh_token) {
    const { exp: keycloakTokenExpire, azp: keycloakClientId } = jwtDecode<{
      exp: number;
      azp: string;
    }>(refresh_token);

    isTokenExpired = keycloakTokenExpire < Math.floor(Date.now() / 1000);
    isAnonymousToken = keycloakClientId === keycloakConfig.anonClientId;
  }

  if (!token || !refresh_token || (isTokenExpired && isAnonymousToken)) {
    const data = await getAnonymousToken(keycloakConfig);
    token = data.access_token;
    refresh_token = data.refresh_token;
  }

  const Authorization = `Bearer ${token}`;
  return {
    baseURL: context.frontasticContext?.project.configuration.msURL[msName],
    headers: {
      Authorization,
      refresh_token
    }
  };
};

export default axios;
