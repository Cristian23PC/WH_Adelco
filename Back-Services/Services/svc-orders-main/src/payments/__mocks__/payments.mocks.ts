import { Payment, PaymentDraft } from '@commercetools/platform-sdk';
import { PAYMENT_KEY_STATUS } from '../enum/payment.enum';

export const mockPaymentResponse: Payment = {
  id: '85f70fc1-47fc-4bd5-bf29-48daf2387625',
  version: 1,
  createdAt: '2023-07-14T12:51:07.391Z',
  lastModifiedAt: '2023-07-14T12:51:07.391Z',
  amountPlanned: {
    type: 'centPrecision',
    currencyCode: 'CLP',
    centAmount: 1332,
    fractionDigits: 0
  },
  paymentMethodInfo: {
    method: 'efectivo'
  },
  paymentStatus: {
    state: {
      typeId: 'state',
      id: '842f0673-48e8-4964-9df8-43ed756d2550',
      obj: {
        id: '842f0673-48e8-4964-9df8-43ed756d2550',
        version: 1,
        createdAt: '2023-08-02T16:19:34.614Z',
        lastModifiedAt: '2023-08-02T16:19:34.614Z',
        key: PAYMENT_KEY_STATUS.PENDING,
        type: 'PaymentState',
        roles: [],
        name: {
          'es-CL': 'Pagado'
        },
        builtIn: false,
        initial: false
      }
    }
  },
  custom: {
    type: {
      typeId: 'type',
      id: '3f451fcf-b338-4310-81e4-afa397ffa3d5'
    },
    fields: {
      extraInfo: 'extra info',
      deliveryKey: 'documentId'
    }
  },
  transactions: [],
  interfaceInteractions: []
};

export const mockPaymentDraft: PaymentDraft = {
  paymentStatus: {
    interfaceText: 'Pending'
  },
  paymentMethodInfo: {
    method: 'method-1'
  },
  amountPlanned: {
    centAmount: 1332,
    currencyCode: 'CLP'
  }
};
