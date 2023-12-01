import { registerAs } from '@nestjs/config';

export default registerAs('svc-business-units', () => ({
  baseUrl: process.env.BUSINESS_UNITS_SVC_BASE_URL ?? 'http://service-svc-business-units.commerce.svc.cluster.local/business/v1'
}));
