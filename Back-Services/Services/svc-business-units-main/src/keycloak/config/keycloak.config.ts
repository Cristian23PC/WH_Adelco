import { registerAs } from '@nestjs/config';

export default registerAs('keycloak', () => ({
  host: process.env.KEYCLOAK_HOST ?? 'keycloak-host',
  realm: process.env.KEYCLOAK_REALM ?? 'keycloak-realm',
  clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'keycloak-client-id',
  clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? 'KEYCLOAK_CLIENT_SECRET_VALUE',
  maxVerificationCodeFailures: process.env.MAX_VERIFICATION_CODE_FAILURES ?? 3
}));
