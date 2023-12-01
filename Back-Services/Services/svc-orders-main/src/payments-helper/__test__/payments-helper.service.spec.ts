import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsHelperService } from '../payments-helper.service';
import { PaymentDraft } from '@commercetools/platform-sdk';
import { STATE_STATUS } from '@/payments/payments.interface';

describe('PaymentsHelperService', () => {
  let service: PaymentsHelperService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsHelperService]
    }).compile();

    service = module.get<PaymentsHelperService>(PaymentsHelperService);
  });

  describe('buildPaymentDraft', () => {
    let response: PaymentDraft;

    beforeEach(() => {
      response = service.buildPaymentDraft(
        'method-1',
        {
          subtotalPrice: 10,
          discounts: [],
          netPrice: 10,
          taxes: [],
          grossPrice: 10
        },
        'bu-id1'
      );
    });

    it('should return PaymentDraft successfully', () => {
      expect(response).toEqual({
        amountPlanned: { centAmount: 10, currencyCode: 'CLP' },
        paymentMethodInfo: { method: 'method-1' },
        paymentStatus: {
          state: {
            key: STATE_STATUS.PENDING,
            typeId: 'state'
          }
        },
        custom: {
          type: {
            key: 'adelco-payment-type',
            typeId: 'type'
          },
          fields: {
            businessUnitId: 'bu-id1'
          }
        }
      });
    });
  });
});
