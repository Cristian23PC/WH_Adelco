import { registerAs } from '@nestjs/config';

export default registerAs('custom-object-sequence', () => ({
  sequenceContainer: process.env.SEQUENCE_CONTAINER_NAME ?? 'sequence',
  orderNumberKey: process.env.ORDER_NUMBER_KEY ?? 'orderNumber'
}));
