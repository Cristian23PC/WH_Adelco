import { registerAs } from '@nestjs/config';

export default registerAs('carts', () => ({
  shippingMethodKey: process.env.SHIPPING_METHOD_KEY ?? 'default'
}));
