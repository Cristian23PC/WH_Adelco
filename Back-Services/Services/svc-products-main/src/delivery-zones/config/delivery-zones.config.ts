import { registerAs } from '@nestjs/config';

export default registerAs('custom-object', () => ({
  t2ZoneContainer: process.env.T2_ZONE_CONTAINER_NAME ?? 'delivery-zone',
  t2ZoneCacheTTL: process.env.T2_ZONE_CACHE_TTL ?? 86400000 // a day in milliseconds
}));
