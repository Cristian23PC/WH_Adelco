import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  minimumOrderCentAmount: process.env.MINIMUM_ORDER_CENT_AMOUNT ?? 50000
}));
