import { registerAs } from '@nestjs/config';

export default registerAs('channels', () => ({
  cacheTTL: process.env.CHANNEL_CACHE_TTL ?? 86400000 // a day in milliseconds
}));
