import { registerAs } from '@nestjs/config';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';

export default registerAs('businessUnits', () => ({
  userHeaderId: process.env.CUSTOMER_HEADER_ID ?? userHeaderId,
  userHeaderRoles: process.env.CUSTOMER_HEADER_ROLES ?? userHeaderRoles,
  divisionLimit: process.env.DIVISION_LIMIT ?? 50
}));
