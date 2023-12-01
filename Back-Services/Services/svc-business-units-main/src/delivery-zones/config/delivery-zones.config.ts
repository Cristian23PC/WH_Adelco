import { registerAs } from '@nestjs/config';

export default registerAs('custom-object-delivery-zone', () => ({
  deliveryZoneContainer: process.env.DELIVERY_ZONE_CONTAINER_NAME ?? 'delivery-zone'
}));
