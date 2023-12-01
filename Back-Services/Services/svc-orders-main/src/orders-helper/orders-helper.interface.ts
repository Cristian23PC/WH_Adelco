import { CollectPaymentsDtoRequest, Payment as CollectPayment } from '@/orders/dto/collect-payments.dto';
import { IPaymentCancelled, KEY_PAYMENT_STATE } from '@/orders/orders.interface';
import { CustomObjectDraft, Delivery, OrderUpdateAction, Payment, PaymentUpdateAction, TypeReference } from '@commercetools/platform-sdk';
import { ORDER_SOURCE } from '@/business-unit-orders/enum/business-unit-orders.enum';
import { PAYMENT_METHOD } from '@/payments/enum/payment.enum';

export interface IGetPaymentsPendingAndPaids {
  paymentsPaids: string[];
  paymentsPending: IPaymentCancelled[];
}

export interface IAssociatedDocsForPayments {
  documentId: string;
  dteType?: string;
  dteNumber?: string;
  dteDate?: string;
  sapDocumentId?: string;
  amount: number;
  isPartial: boolean;
}

export interface IAssociatedDocsForCreditNotes {
  documentId: string;
  dteType?: string;
  dteNumber?: string;
  dteDate?: string;
  amount: number;
  isPartial: boolean;
}

export interface IFormatDelivery extends Delivery {
  custom: {
    type: TypeReference;
    fields: {
      [x: string]: any;
      paymentInfo: Payment[];
      orderId: string;
      orderVersion: number;
      owedAmount?: { centAmount: number };
    };
  };
}

export interface IOrderActions {
  [orderId: string]: {
    orderId: string;
    version: number;
    actions: OrderUpdateAction[];
  };
}

export interface IOrderDeliveryAction {
  deliveryId: string;
  centAmount?: number;
  paymentInfo?: string[];
}

export interface IPaymentAction {
  associatedDocs?: IAssociatedDocsForPayments[];
  paymentState?: KEY_PAYMENT_STATE;
}

export interface IPaymentActions {
  [paymentId: string]: {
    paymentId: string;
    version: number;
    actions: PaymentUpdateAction[];
  };
}

export interface IHandleCollectPayments {
  orderActions: IOrderActions[string][];
  paymentActions: IPaymentActions[string][];
  creditNotesActions: CustomObjectDraft[];
}

export interface IPaymentDeliveryRelation {
  [paymentId: string]: {
    version: number;
    docs?: {
      [deliveryId: string]: IAssociatedDocsForPayments;
    };
  };
}

export interface ICreatePayment {
  centAmount: number;
  payment?: CollectPaymentsDtoRequest['payments'][0];
  businessUnitId: string;
  paymentState?: KEY_PAYMENT_STATE;
  method?: PAYMENT_METHOD;
}

export interface OrderCustomFieldsDraftProps {
  source: ORDER_SOURCE;
  paymentCondition: string;
  customerComment?: string;
  purchaseNumber?: string;
  sapPaymentMethodCode: string;
}

export interface CombineCreditNotes {
  creditNoteId: string;
  method: PAYMENT_METHOD;
  documentId?: string;
  dteType?: string;
  dteNumber?: string;
  dteDate?: string;
  amountPaid: number;
  isCreditNote: boolean;
}

export interface CombinePayment extends CollectPayment {
  isCreditNote: boolean;
}

export interface CombineCreditNotesAndPaymentsResponse extends Omit<CombineCreditNotes, 'isCreditNote'>, Omit<CombinePayment, 'isCreditNote'> {
  isCreditNote: boolean;
}
