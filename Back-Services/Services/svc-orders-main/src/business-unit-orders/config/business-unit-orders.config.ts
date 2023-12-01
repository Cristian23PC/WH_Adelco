import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { registerAs } from '@nestjs/config';

export default registerAs('business-unit-orders', () => ({
  userHeaderId: process.env.CUSTOMER_HEADER_ID ?? userHeaderId,
  userHeaderRoles: process.env.CUSTOMER_HEADER_ROLES ?? userHeaderRoles
}));
