import { registerAs } from '@nestjs/config';

export default registerAs('state', () => ({
  orderStateCacheTTL: process.env.ORDER_STATE_CACHE_TTL ? Number.parseInt(process.env.ORDER_STATE_CACHE_TTL) : 31536000000
}));
