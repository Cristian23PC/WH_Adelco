import { registerAs } from '@nestjs/config';

export default registerAs('notifications', () => {
  return {
    mongoDeliveriesSync: process.env.MONGO_DELIVERIES_SYNC,
    orderUpdate: process.env.ORDER_UPDATED_SYNC
  };
});
