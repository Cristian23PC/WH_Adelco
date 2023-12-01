import { registerAs } from '@nestjs/config';

export default registerAs('custom-object', () => ({
  t2zoneContainer: process.env.T2_ZONE_CONTAINER_NAME ?? 'delivery-zone'
}));
