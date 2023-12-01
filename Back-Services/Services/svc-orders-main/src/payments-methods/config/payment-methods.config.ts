import { registerAs } from '@nestjs/config';

export default registerAs('custom-object-payment-method', () => ({
  paymentMethodContainer: process.env.PAYMENT_METHOD_CONTAINER_NAME ?? 'payment-method',
  sapCashPaymentConditionCode: process.env.SAP_CASH_PAYMENT_CONDITION_CODE ?? 'ZD01'
}));
