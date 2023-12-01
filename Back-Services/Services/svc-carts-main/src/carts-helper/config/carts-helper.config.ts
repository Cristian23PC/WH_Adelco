import { registerAs } from '@nestjs/config';

export default registerAs('cartsHelper', () => ({
  priceCurrency: process.env.CLP_CURRENCY ?? 'CLP',
  salesCartVerificationTimeMinutes: process.env.SALES_CART_VERIFICATION_TIME_MINUTES ?? 300,
  ecommerceCartVerificationTimeMinutes: process.env.ECOMMERCE_CART_VERIFICATION_TIME_MINUTES ?? 300
}));
