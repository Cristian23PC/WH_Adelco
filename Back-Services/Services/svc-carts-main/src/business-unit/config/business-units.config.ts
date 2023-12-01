import { registerAs } from '@nestjs/config';

export default registerAs('businessUnits', () => ({
  baseUrl: process.env.BUSINESS_UNITS_SVC_BASE_URL ?? 'https://api-nonprod.adelco.cl/dev/business/v1'
}));
