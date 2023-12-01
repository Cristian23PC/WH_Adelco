import { STATE_STATUS } from '@/payments/payments.interface';
import { TotalDetails } from '@adelco/price-calc';
import { PaymentDraft } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentsHelperService {
  buildPaymentDraft(method: string, totalDetails: TotalDetails, businessUnitId: string): PaymentDraft {
    return {
      paymentStatus: {
        state: {
          typeId: 'state',
          key: STATE_STATUS.PENDING
        }
      },
      paymentMethodInfo: {
        method
      },
      amountPlanned: {
        centAmount: totalDetails.grossPrice,
        currencyCode: 'CLP'
      },
      custom: {
        type: {
          typeId: 'type',
          key: 'adelco-payment-type'
        },
        fields: {
          businessUnitId
        }
      }
    };
  }
}
