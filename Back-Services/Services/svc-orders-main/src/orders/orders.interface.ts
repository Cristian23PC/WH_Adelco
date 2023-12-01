import { CustomObject, Payment } from '@commercetools/platform-sdk';

export enum PAYMENT_STATE {
  BALANCE_DUE = 'BalanceDue',
  FAILED = 'Failed',
  PENDING = 'Pending',
  CREDIT_OWED = 'CreditOwed',
  PAID = 'Paid'
}

export enum SHIPMENT_STATE {
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  READY = 'Ready',
  PENDING = 'Pending',
  DELAYED = 'Delayed',
  PARTIAL = 'Partial',
  BACK_ORDER = 'Backorder'
}

export enum KEY_LINE_ITEM_STATE {
  SHIPPED = 'LineItemShipped',
  RETURNED = 'LineItemReturned',
  DELIVERED = 'LineItemDelivered'
}

export enum KEY_ORDER_STATE {
  OPEN = 'OrderOpen',
  BLOCKED_BY_CREDIT = 'OrderBlockedByCredit',
  COMPLETED = 'OrderComplete',
  NOT_DELIVERED = 'OrderNotDelivered'
}

export enum KEY_PAYMENT_STATE {
  CREDIT_OWED = 'PaymentCreditOwed',
  FAILED = 'PaymentFailed',
  CANCELLED = 'PaymentCancelled',
  PENDING = 'PaymentPending',
  PAID = 'PaymentPaid'
}

export interface IPaymentCancelled {
  id: string;
  version: number;
}

export interface CollectPaymentsResponse<T> {
  orders: T[];
  payments: Payment[];
  creditNotes: CustomObject[];
}
