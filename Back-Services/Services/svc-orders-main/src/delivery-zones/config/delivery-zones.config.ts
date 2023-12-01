import { registerAs } from '@nestjs/config';

export default registerAs('custom-object', () => ({
  t2zoneContainer: process.env.DELIVERY_ZONE_CONTAINER_NAME ?? 'delivery-zone'
}));
