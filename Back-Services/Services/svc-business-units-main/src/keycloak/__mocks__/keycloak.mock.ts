import { KeycloakToken, KeycloakUser } from '../interfaces/keycloak.interface';

export const keycloakTokenMock: KeycloakToken = {
  access_token: 'access_token',
  expires_in: 1000,
  refresh_expires_in: 0,
  token_type: 'token_type',
  'not-before-policy': 0,
  scope: 'scope'
};

export const keycloakUserMock: KeycloakUser = {
  id: 'id',
  createdTimestamp: 0,
  username: 'username@username.com',
  enabled: false,
  totp: false,
  emailVerified: false,
  firstName: 'first-name',
  lastName: 'last-name',
  email: 'username@username.com',
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 0,
  access: {
    manageGroupMembership: false,
    view: false,
    mapRoles: false,
    impersonate: false,
    manage: false
  },
  attributes: {
    verificationCodeData: ['MTIzNF8yNjgyNjI4NjM0'],
    companyRut: ['123456789'],
    contactPhone: ['1234567891'],
    remainingAttempts: ['3']
  }
};

export const keycloakExpiredCodeUserMock: KeycloakUser = {
  id: 'id',
  createdTimestamp: 0,
  username: 'username@username.com',
  enabled: false,
  totp: false,
  emailVerified: false,
  firstName: 'first-name',
  lastName: 'last-name',
  email: 'username@username.com',
  disableableCredentialTypes: [],
  requiredActions: [],
  notBefore: 0,
  access: {
    manageGroupMembership: false,
    view: false,
    mapRoles: false,
    impersonate: false,
    manage: false
  },
  attributes: {
    verificationCodeData: ['MTIzNDU2NzhfMTU4MjYyODYzNA=='],
    companyRut: ['123456789']
  }
};
