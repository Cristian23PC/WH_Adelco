import { registerAs } from '@nestjs/config';

export default registerAs('custom-object-payment-method', () => ({
  paymentMethodContainer: process.env.PAYMENT_METHOD_CONTAINER_NAME ?? 'payment-method'
}));
