export interface KeycloakToken {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  'not-before-policy': number;
  scope: string;
}

export interface KeycloakUserAttributes {
  verificationCodeData?: string[];
  companyRut?: string[];
  contactPhone?: string[];
  companyName?: string[];
  remainingAttempts?: string[];
}

export interface KeycloakUser {
  id: string;
  createdTimestamp: number;
  username: string;
  enabled: boolean;
  totp: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  disableableCredentialTypes: [];
  requiredActions: [];
  notBefore: number;
  credentials?: {
    credentialData: string;
    value: string;
  }[];
  access: {
    manageGroupMembership: boolean;
    view: boolean;
    mapRoles: boolean;
    impersonate: boolean;
    manage: boolean;
  };
  attributes?: KeycloakUserAttributes;
}

export interface KeycloakUserCreationResponse {
  status?: number;
  message?: string;
  errorMessage?: string;
}

export interface IEnvironmentKeycloak {
  clientId: string;
  clientSecret: string;
  clientSecretKey?: string;
  host: string;
  realm: string;
}
