import { registerAs } from '@nestjs/config';

export default registerAs('customerBusinessUnits', () => ({
  customerHeaderKey: process.env.CUSTOMER_HEADER_KEY ?? 'x-user-id'
}));
