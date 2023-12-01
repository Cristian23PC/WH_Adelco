export const SALES_BASE_URL = process.env.NEXT_PUBLIC_SALES_BASE_URL;

export const KEYCLOAK_CONFIG = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL as string,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM as string,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID as string
};
