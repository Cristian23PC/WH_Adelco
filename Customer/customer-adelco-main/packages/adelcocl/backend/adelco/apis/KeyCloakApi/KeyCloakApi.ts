import { EmailPassword } from '@Types/adelco/user';
import { URLSearchParams } from 'url';
import axios from 'axios';

export const getToken = async (
  { username, password }: EmailPassword,
  keycloakConfig: any
) => {
  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: keycloakConfig.clientId,
    username,
    password
  });

  const { data } = await axios.post(`${keycloakConfig.URL}/token`, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  return data;
};

export const getAnonymousToken = async (keycloakConfig: any) => {
  const params = new URLSearchParams({
    grant_type: 'password',
    client_id: keycloakConfig.anonClientId,
    username: keycloakConfig.anonUsername,
    password: keycloakConfig.anonPassword
  });

  const { data } = await axios.post(
    `${keycloakConfig.anonURL}/token`,
    params.toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  return data;
};

export const getRefreshToken = async (
  keycloakURL: string,
  keycloakClientId: string,
  refreshToken: string
) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: keycloakClientId,
    refresh_token: refreshToken
  });

  const { data } = await axios.post(
    `${keycloakURL}/protocol/openid-connect/token`,
    params.toString(),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
  );

  return data;
};
