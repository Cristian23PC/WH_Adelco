import { registerAs } from '@nestjs/config';

export default registerAs('svc-carts', () => ({
  baseUrl: process.env.CARTS_SVC_BASE_URL ?? 'http://service-svc-carts.commerce.svc.cluster.local/carts/v1'
}));
