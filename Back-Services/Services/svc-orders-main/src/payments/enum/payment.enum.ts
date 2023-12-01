export enum PAYMENT_STATUS {
  PENDING = 'Pending',
  TO_COLLECT = 'ToCollect',
  PAID = 'Paid',
  CREDIT_OWED = 'CreditOwed'
}

export enum PAYMENT_CONDITION {
  CASH = 'Cash',
  CREDIT = 'Credit'
}

export enum PAYMENT_METHOD {
  CASH = 'Cash',
  BANK_TRANSFER = 'BankTransfer',
  CREDIT = 'Credit',
  DAY_CHECK = 'DayCheck',
  DATE_CHECK = 'DateCheck',
  CREDIT_CARD = 'CreditCard',
  DEBIT_CARD = 'DebitCard',
  CREDIT_NOTE = 'CreditNote'
}

export enum PAYMENT_KEY_STATUS {
  FAILED = 'PaymentFailed',
  PENDING = 'PaymentPending',
  CREDIT_OWED = 'PaymentCreditOwed',
  PAID = 'PaymentPaid'
}
