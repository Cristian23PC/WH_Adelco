import { setToken } from '@/utils/axiosInstance';
import { KEYCLOAK_CONFIG } from '../config';
import Keycloak from 'keycloak-js';
import { Role } from '@/types/User';

const TOKEN_EXPIRATION_TOLERANCE = 30;

let keycloakInstance: Keycloak;

const getKeycloakInstance = () => {
  if (keycloakInstance) return keycloakInstance;
  if (typeof window !== 'undefined') {
    const keyCloak = new Keycloak(KEYCLOAK_CONFIG);
    keycloakInstance = keyCloak;
    return keyCloak;
  }
  return null;
};

export const login = async () => {
  const keyCloak = getKeycloakInstance();

  await keyCloak?.login({
    redirectUri: process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URI
  });

  setToken(keyCloak?.token, keyCloak?.refreshToken);
};

export const init = async () => {
  const keyCloak = getKeycloakInstance();
  try {
    const authenticated = await keyCloak?.init({
      checkLoginIframe: false,
      refreshToken: localStorage.getItem('refresh_token') || undefined,
      token: localStorage.getItem('access_token') || undefined
    });

    if (authenticated) {
      const { token, refreshToken, idTokenParsed, resourceAccess } =
        keyCloak || {};
      setToken(token, refreshToken);

      return {
        name: idTokenParsed?.name,
        givenName: idTokenParsed?.given_name,
        email: idTokenParsed?.email,
        phone: idTokenParsed?.phone,
        role: resourceAccess?.adelco_management_app?.roles?.[0] as
          | Role
          | undefined
      };
    }

    throw {};
  } catch (e) {
    setToken();
    return {
      isError: true
    };
  }
};

export const refreshToken = async () => {
  const keyCloak = getKeycloakInstance();
  try {
    await keyCloak?.updateToken(TOKEN_EXPIRATION_TOLERANCE);
  } catch (error) {
    console.error('Failed to refresh token:', error);
    logout();
  } finally {
    if (keyCloak?.authenticated) {
      setToken(keyCloak.token, keyCloak.refreshToken);
    }
  }
};

export const logout = async () => {
  const keyCloak = getKeycloakInstance();

  setToken();
  await keyCloak?.logout({
    redirectUri: process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_URI
  });
};
