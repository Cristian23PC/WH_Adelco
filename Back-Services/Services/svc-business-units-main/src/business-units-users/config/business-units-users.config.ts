import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { registerAs } from '@nestjs/config';

export default registerAs('business-unit-users', () => ({
  codeExpirationTime: process.env.REGISTRATION_CODE_EXPIRATION_TIME ?? 3600,
  userHeaderId: process.env.CUSTOMER_HEADER_ID ?? userHeaderId,
  userHeaderRoles: process.env.CUSTOMER_HEADER_ROLES ?? userHeaderRoles,
  validUsernameList: process.env.VALID_USERNAME_LIST ?? '^.*$'
}));
