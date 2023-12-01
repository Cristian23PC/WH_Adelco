const mockSequenceService = {
  getOrderNumber: jest.fn(() => {
    return Promise.resolve(String(mockSequenceResponse.value).padStart(10, '0'));
  }),
  update: jest.fn(() => {
    return Promise.resolve(String(mockNewSequenceResponse.value).padStart(10, '0'));
  })
};

jest.mock('@/sequence/sequence.service', () => ({
  SequenceService: jest.fn().mockImplementation(() => mockSequenceService)
}));

const mockStatesService = {
  getByKey: jest.fn(() => {
    return Promise.resolve(mockStateResponse);
  })
};

jest.mock('@/state/states.service', () => ({
  StatesService: jest.fn().mockImplementation(() => mockStatesService)
}));

const mockPaymentsService = {
  create: jest.fn()
};

jest.mock('@/payments/payments.service', () => ({
  PaymentsService: jest.fn().mockImplementation(() => mockPaymentsService)
}));

jest.useFakeTimers().setSystemTime(new Date('2023-10-01'));

import { Test, TestingModule } from '@nestjs/testing';
import { OrdersHelperService } from '../orders-helper.service';
import { SequenceService } from '@/sequence/sequence.service';
import { OrderFromCartDraft, Payment } from '@commercetools/platform-sdk';
import { mockGetActiveCart } from '@/svc-carts/__mocks__/svc-carts.mock';
import { mockNewSequenceResponse, mockSequenceResponse } from '@/sequence/__mocks__/sequence.mocks';
import { mockStateResponse } from '@/state/__mocks__/states.mock';
import { StatesService } from '@/state/states.service';
import { PaymentsService } from '@/payments/payments.service';
import { CollectPaymentsDtoRequest } from '@/orders/dto/collect-payments.dto';
import {
  CombineCreditNotesAndPaymentsResponse,
  IAssociatedDocsForPayments,
  IFormatDelivery,
  IHandleCollectPayments,
  IOrderActions,
  IPaymentActions
} from '../orders-helper.interface';
import { KEY_PAYMENT_STATE } from '@/orders/orders.interface';
import { mockHandleCollecyPaymentsResponse } from '../__mocks__/mock';
import { ORDER_SOURCE } from '@/business-unit-orders/enum/business-unit-orders.enum';
import { creditNotesMock } from '@/credit-notes/__mocks__/credit-notes.mock';
import { PAYMENT_METHOD } from '@/payments/enum/payment.enum';

describe('OrdersHelperService', () => {
  let service: OrdersHelperService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersHelperService, SequenceService, StatesService, PaymentsService]
    }).compile();

    service = module.get<OrdersHelperService>(OrdersHelperService);
  });

  describe('buildOrderFromCartDraft', () => {
    const CASH_PAYMENT_CONDITION_CODE = 'ZD01';
    const CASH_PAYMENT_METHOD_SAP_CODE = 'E';

    describe('when succeeds', () => {
      let response: OrderFromCartDraft;

      beforeEach(async () => {
        response = await service.buildOrderFromCartDraft(mockGetActiveCart, {
          source: ORDER_SOURCE.SALES_APP,
          customerComment: 'customerComment',
          paymentCondition: CASH_PAYMENT_CONDITION_CODE,
          sapPaymentMethodCode: CASH_PAYMENT_METHOD_SAP_CODE,
          purchaseNumber: '123'
        });
      });

      it('should return OrderFromCartDraft successfully', () => {
        expect(response).toEqual({
          cart: { id: '8f30b00b-940c-4616-b65a-66c0511e2cf7', typeId: 'cart' },
          orderNumber: '0000000001',
          paymentState: 'Pending',
          shipmentState: 'Pending',
          state: {
            id: mockStateResponse.id,
            typeId: 'state'
          },
          version: 1,
          custom: {
            fields: {
              customerComment: 'customerComment',
              source: 'sales',
              purchaseNumber: '123',
              paymentCondition: CASH_PAYMENT_CONDITION_CODE,
              sapPaymentMethodCode: CASH_PAYMENT_METHOD_SAP_CODE
            },
            type: {
              key: 'adelco-cart-type',
              typeId: 'type'
            }
          }
        });
      });
    });

    describe('when succeeds and not send custommerComment', () => {
      let response: OrderFromCartDraft;

      beforeEach(async () => {
        response = await service.buildOrderFromCartDraft(mockGetActiveCart, {
          source: ORDER_SOURCE.SALES_APP,
          paymentCondition: CASH_PAYMENT_CONDITION_CODE,
          sapPaymentMethodCode: CASH_PAYMENT_METHOD_SAP_CODE
        });
      });

      it('should return OrderFromCartDraft successfully', () => {
        expect(response).toEqual({
          cart: { id: '8f30b00b-940c-4616-b65a-66c0511e2cf7', typeId: 'cart' },
          orderNumber: '0000000001',
          paymentState: 'Pending',
          shipmentState: 'Pending',
          state: {
            id: mockStateResponse.id,
            typeId: 'state'
          },
          version: 1,
          custom: {
            fields: {
              source: 'sales',
              paymentCondition: CASH_PAYMENT_CONDITION_CODE,
              sapPaymentMethodCode: CASH_PAYMENT_METHOD_SAP_CODE
            },
            type: {
              key: 'adelco-cart-type',
              typeId: 'type'
            }
          }
        });
      });
    });
  });

  describe('formatDeliveries', () => {
    const mockOrders: any[] = [
      {
        shippingInfo: {
          deliveries: [
            { key: 'invoice1', custom: { fields: { dteNumber: 'invoice1', paymentInfo: ['payment1'], expirationDate: '2023-10-01' } } },
            { key: 'invoice2', custom: { fields: { dteNumber: 'invoice2', paymentInfo: ['payment2'], expirationDate: '2023-11-01' } } }
          ]
        },
        paymentInfo: {
          payments: [
            { id: 'payment1', obj: 'PaymentObj1' },
            { id: 'payment2', obj: 'PaymentObj2' }
          ]
        }
      }
    ];

    const mockInvoices: string[] = ['invoice1', 'invoice2'];

    it('should return correct deliveries', () => {
      const result = service.formatDeliveries(mockOrders, mockInvoices);
      expect(result).toEqual([
        { key: 'invoice1', custom: { fields: { dteNumber: 'invoice1', paymentInfo: ['PaymentObj1'], expirationDate: '2023-10-01' } } },
        { key: 'invoice2', custom: { fields: { dteNumber: 'invoice2', paymentInfo: ['PaymentObj2'], expirationDate: '2023-11-01' } } }
      ]);
    });

    it('should sort deliveries by expirationDate', () => {
      const result = service.formatDeliveries(mockOrders, mockInvoices);
      expect(result[0].custom?.fields?.expirationDate).toBe('2023-10-01');
      expect(result[1].custom?.fields?.expirationDate).toBe('2023-11-01');
    });

    it('should throw error when an invoice is missing', () => {
      expect(() => {
        service.formatDeliveries(mockOrders, ['invoice1', 'invoiceNotFound']);
      }).toThrowError('Deliveries ["invoiceNotFound"] not found');
    });
  });

  describe('getPaymentsPendingAndPaids', () => {
    it('should correctly identify pending payments', () => {
      const mockPayments: Payment[] = [
        { id: '1', version: 1, paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.PENDING } } } },
        { id: '2', version: 1, paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.PAID } } } }
      ] as any;
      const result = (service as any)['getPaymentsPendingAndPaids'](mockPayments);
      expect(result.paymentsPending).toEqual([{ id: '1', version: 1 }]);
    });

    it('should correctly identify paid payments', () => {
      const mockPayments: Payment[] = [
        { id: '1', version: 1, paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.PENDING } } } },
        { id: '2', version: 1, paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.PAID } } } }
      ] as any;
      const result = (service as any)['getPaymentsPendingAndPaids'](mockPayments);
      expect(result.paymentsPaids).toEqual(['2']);
    });

    it('should handle empty array', () => {
      const mockPayments: Payment[] = [];
      const result = (service as any)['getPaymentsPendingAndPaids'](mockPayments);
      expect(result).toEqual({ paymentsPaids: [], paymentsPending: [] });
    });
  });

  describe('createPayment', () => {
    it('should call paymentsService.create() with correct parameters', async () => {
      const mockPaymentDto: CollectPaymentsDtoRequest['payments'][0] = {
        checkExpirationDate: '2022-12-01',
        method: 'METHOD',
        checkNumber: '123'
      } as any;
      const mockCentAmount = 100;
      const mockBusinessUnitId = 'unit123';

      mockPaymentsService.create.mockReturnValue(Promise.resolve({}));

      (service as any)['createPayment']({ centAmount: mockCentAmount, payment: mockPaymentDto, businessUnitId: mockBusinessUnitId });

      expect(mockPaymentsService.create).toHaveBeenCalledWith({
        amountPlanned: {
          centAmount: mockCentAmount,
          currencyCode: 'CLP'
        },
        paymentMethodInfo: {
          method: 'METHOD'
        },
        paymentStatus: {
          state: {
            typeId: 'state',
            key: KEY_PAYMENT_STATE.PENDING
          }
        },
        custom: {
          type: {
            typeId: 'type',
            key: 'adelco-payment-type'
          },
          fields: {
            checkExpirationDate: mockPaymentDto.checkExpirationDate,
            checkNumber: mockPaymentDto.checkNumber,
            businessUnitId: mockBusinessUnitId
          }
        }
      });
    });
  });

  describe('orderDeliveryAction', () => {
    it('should perform the correct action for owedAmount', () => {
      const result = (service as any).consolidateOrderDeliveryOwedAction({ actions: [] }, { deliveryId: 'someId', centAmount: 100 });
      expect(result).toEqual({
        actions: [
          {
            action: 'setDeliveryCustomField',
            deliveryId: 'someId',
            name: 'owedAmount',
            value: {
              currencyCode: 'CLP',
              centAmount: 100
            }
          }
        ]
      });
    });

    it('should perform the correct action for paymentInfo', () => {
      const orderActions: IOrderActions = {};
      const args = {
        deliveryId: 'delivery123',
        centAmount: 200,
        paymentInfo: 'otherPaymentInfo'
      };

      const result = (service as any).consolidateOrderDeliveryPaymentAction(orderActions, args);

      expect(result).toEqual({
        actions: [
          {
            action: 'setDeliveryCustomField',
            deliveryId: args.deliveryId,
            name: 'paymentInfo',
            value: 'otherPaymentInfo'
          }
        ]
      });
    });
  });

  describe('orderPaymentAction', () => {
    const orderId = 'order-id';
    const orderActions: IOrderActions = {};

    it('should add a payment if it does not already exist', () => {
      const result = (service as any).consolidateOrderPaymentAction('addPayment', orderActions[orderId], 'add-payment-id');
      expect(result).toEqual({
        actions: [
          {
            action: 'addPayment',
            payment: {
              typeId: 'payment',
              id: 'add-payment-id'
            }
          }
        ]
      });
    });

    it('should remove a payment if it does not already exist', () => {
      const result = (service as any).consolidateOrderPaymentAction('removePayment', orderActions[orderId], 'remove-payment-id');
      expect(result).toEqual({
        actions: [
          {
            action: 'removePayment',
            payment: {
              typeId: 'payment',
              id: 'remove-payment-id'
            }
          }
        ]
      });
    });

    it('should not remove a already payment', () => {
      orderActions[orderId] = (service as any).consolidateOrderPaymentAction('removePayment', orderActions[orderId], 'remove-payment-id');
      const result = (service as any).consolidateOrderPaymentAction('removePayment', orderActions[orderId], 'remove-payment-id');

      expect(result).toEqual({
        actions: [
          {
            action: 'removePayment',
            payment: {
              typeId: 'payment',
              id: 'remove-payment-id'
            }
          }
        ]
      });
    });
  });

  describe('paymentAction', () => {
    let paymentActions: IPaymentActions;

    beforeEach(() => {
      paymentActions = {
        'payment-id': {
          paymentId: 'payment-id',
          version: 1,
          actions: []
        }
      };
    });

    it('should transition the payment state to CANCELLED', () => {
      const result = (service as any).paymentAction('transitionState', paymentActions, 'payment-id', 1);
      expect(result).toEqual({
        paymentId: 'payment-id',
        version: 1,
        actions: [
          {
            action: 'transitionState',
            state: {
              typeId: 'state',
              key: KEY_PAYMENT_STATE.CANCELLED
            }
          }
        ]
      });
    });

    it('should add associatedDocs custom field if action is setCustomField', () => {
      const associatedDocs: IAssociatedDocsForPayments[] = [
        {
          documentId: 'doc1',
          dteType: 'type1',
          dteNumber: 'num1',
          dteDate: 'date1',
          amount: 100,
          isPartial: false
        }
      ];
      const result = (service as any).paymentAction('setCustomField', paymentActions, 'payment-id', 1, { associatedDocs });
      expect(result).toEqual({
        ...paymentActions,
        actions: [
          {
            action: 'setCustomField',
            name: 'associatedDocs',
            value: JSON.stringify(associatedDocs)
          }
        ]
      });
    });
  });

  describe('addPaymentDeliveryRelation', () => {
    it('should add a new payment delivery relation', () => {
      const delivery: IFormatDelivery = {
        id: 'delivery-id',
        key: 'document-id',
        custom: {
          fields: {
            dteType: 'someType',
            dteNumber: '1234',
            dteDate: '2021-09-13'
          }
        }
      } as any;
      const amount = 100;
      const isPartial = false;

      const result = (service as any).addPaymentDeliveryRelation(delivery, amount, isPartial);
      expect(result).toEqual({
        documentId: 'document-id',
        dteType: 'someType',
        dteNumber: '1234',
        dteDate: '2021-09-13',
        amount: 100,
        isPartial: false
      });
    });

    it('should update an existing payment delivery relation', () => {
      const delivery: IFormatDelivery = {
        id: 'existing-delivery-id',
        key: 'updated-document-id',
        custom: {
          fields: {
            dteType: 'updatedType',
            dteNumber: 'updated1234',
            dteDate: '2021-09-13'
          }
        }
      } as any;
      const amount = 100;
      const isPartial = false;

      const result = (service as any).addPaymentDeliveryRelation(delivery, amount, isPartial);
      expect(result).toEqual({
        documentId: 'updated-document-id',
        dteType: 'updatedType',
        dteNumber: 'updated1234',
        dteDate: '2021-09-13',
        amount: 100,
        isPartial: false
      });
    });
  });

  describe('combineCreditNotesAndPayments', () => {
    let result: CombineCreditNotesAndPaymentsResponse[];
    beforeEach(() => {
      result = service.combineCreditNotesAndPayments(
        [creditNotesMock],
        [
          {
            method: PAYMENT_METHOD.CASH,
            transferNumber: '123',
            checkNumber: '123',
            trxNumber: '123',
            bankCode: '123',
            amountPaid: 234,
            accountNumber: '123',
            checkExpirationDate: '123'
          }
        ]
      );
    });

    it('should return a combine credit notes with payments', () => {
      expect(result).toEqual([
        {
          amountPaid: 1234,
          creditNoteId: '71b91470-86bb-41fc-9b88-3acdf0ccf2cf',
          documentId: 'documentId',
          dteNumber: 'dteNumber',
          dteType: 'NTC',
          isCreditNote: true,
          method: 'CreditNote'
        },
        {
          accountNumber: '123',
          amountPaid: 234,
          bankCode: '123',
          checkExpirationDate: '123',
          checkNumber: '123',
          isCreditNote: false,
          method: 'Cash',
          transferNumber: '123',
          trxNumber: '123'
        }
      ]);
    });
  });

  describe('handleCollectPayments', () => {
    let result: IHandleCollectPayments;
    const spy: { [x: string]: jest.SpyInstance } = {};
    const deliveries: IFormatDelivery[] = [
      { id: 'delivery-1', custom: { fields: { orderId: 'order-1', orderVersion: 1, dteNumber: 'dte1', owedAmount: { centAmount: 500 } } } },
      { id: 'delivery-2', custom: { fields: { orderId: 'order-1', orderVersion: 2, dteNumber: 'dte2', owedAmount: { centAmount: 2000 } } } }
    ] as unknown as IFormatDelivery[];
    const businessUnitId = 'some-business-unit-id';
    const payments: CombineCreditNotesAndPaymentsResponse[] = [
      { amountPaid: 500, isCreditNote: false },
      { amountPaid: 500, isCreditNote: false },
      { amountPaid: 1000, isCreditNote: false }
    ] as any;

    describe('with creditNotes', () => {
      beforeEach(async () => {
        spy.createPayment = jest
          .spyOn(service as any, 'createPayment')
          .mockImplementationOnce(() => Promise.resolve({ id: '1', version: 1 }))
          .mockImplementationOnce(() => Promise.resolve({ id: '2', version: 2 }))
          .mockImplementationOnce(() => Promise.resolve({ id: '3', version: 3 }))
          .mockImplementationOnce(() => Promise.resolve({ id: '4', version: 4 }));
        spy.getPaymentsPendingAndPaids = jest.spyOn(service as any, 'getPaymentsPendingAndPaids').mockImplementation(() => ({
          paymentsPaids: ['payment-paid'],
          paymentsPending: [{ id: 'payment-pending', version: 1 }]
        }));

        const newPayments: CombineCreditNotesAndPaymentsResponse[] = [
          payments[0],
          { amountPaid: 500, isCreditNote: true, creditNoteId: '71b91470-86bb-41fc-9b88-3acdf0ccf2cf' },
          payments[2]
        ] as CombineCreditNotesAndPaymentsResponse[];
        result = await service.handleCollectPayments(deliveries, newPayments, businessUnitId, 'salesRepRUT', [creditNotesMock], 'salesRepUserName');
      });

      it('should return the same amount of order actions', () => {
        expect(result.orderActions.length).toEqual(mockHandleCollecyPaymentsResponse.orderActions.length);
      });

      it('should return the same amount of payments actions', () => {
        expect(result.paymentActions.length).toEqual(mockHandleCollecyPaymentsResponse.paymentActions.length);
      });

      it('should return the correct CollectPayments actions', () => {
        expect(result).toEqual(mockHandleCollecyPaymentsResponse);
      });

      afterAll(() => {
        Object.values(spy).forEach(method => method.mockRestore());
      });
    });

    describe('without creditNotes', () => {
      beforeEach(async () => {
        spy.createPayment = jest
          .spyOn(service as any, 'createPayment')
          .mockImplementationOnce(() => Promise.resolve({ id: '1', version: 1 }))
          .mockImplementationOnce(() => Promise.resolve({ id: '2', version: 2 }))
          .mockImplementationOnce(() => Promise.resolve({ id: '3', version: 3 }))
          .mockImplementationOnce(() => Promise.resolve({ id: '4', version: 4 }));
        spy.getPaymentsPendingAndPaids = jest.spyOn(service as any, 'getPaymentsPendingAndPaids').mockImplementation(() => ({
          paymentsPaids: ['payment-paid'],
          paymentsPending: [{ id: 'payment-pending', version: 1 }]
        }));

        result = await service.handleCollectPayments(deliveries, payments, businessUnitId, 'salesRepRUT', [], 'salesRepUserName');
      });

      it('should return the same amount of order actions', () => {
        expect(result.orderActions.length).toEqual(mockHandleCollecyPaymentsResponse.orderActions.length);
      });

      it('should return the same amount of payments actions', () => {
        expect(result.paymentActions.length).toEqual(mockHandleCollecyPaymentsResponse.paymentActions.length);
      });

      it('should return the correct CollectPayments actions', () => {
        expect(result).toEqual({
          ...mockHandleCollecyPaymentsResponse,
          creditNotesActions: [],
          paymentActions: [
            {
              actions: [
                {
                  action: 'setCustomField',
                  name: 'associatedDocs',
                  value: '[{"dteNumber":"dte1","amount":500,"isPartial":false}]'
                },
                {
                  action: 'setCustomField',
                  name: 'paymentDate',
                  value: '2023-10-01'
                },
                {
                  action: 'transitionState',
                  state: {
                    key: 'PaymentPaid',
                    typeId: 'state'
                  }
                },
                {
                  action: 'setCustomField',
                  name: 'salesRepRUT',
                  value: 'salesRepRUT'
                },
                {
                  action: 'setCustomField',
                  name: 'collectedBy',
                  value: 'salesRepUserName'
                }
              ],
              paymentId: '1',
              version: 1
            },
            {
              actions: [
                {
                  action: 'setCustomField',
                  name: 'associatedDocs',
                  value: '[{"dteNumber":"dte2","amount":500,"isPartial":true}]'
                },
                {
                  action: 'setCustomField',
                  name: 'paymentDate',
                  value: '2023-10-01'
                },
                {
                  action: 'transitionState',
                  state: {
                    key: 'PaymentPaid',
                    typeId: 'state'
                  }
                },
                {
                  action: 'setCustomField',
                  name: 'salesRepRUT',
                  value: 'salesRepRUT'
                },
                {
                  action: 'setCustomField',
                  name: 'collectedBy',
                  value: 'salesRepUserName'
                }
              ],
              paymentId: '2',
              version: 2
            },
            {
              actions: [
                {
                  action: 'setCustomField',
                  name: 'associatedDocs',
                  value: '[{"dteNumber":"dte2","amount":1000,"isPartial":true}]'
                },
                {
                  action: 'setCustomField',
                  name: 'paymentDate',
                  value: '2023-10-01'
                },
                {
                  action: 'transitionState',
                  state: {
                    key: 'PaymentPaid',
                    typeId: 'state'
                  }
                },
                {
                  action: 'setCustomField',
                  name: 'salesRepRUT',
                  value: 'salesRepRUT'
                },
                {
                  action: 'setCustomField',
                  name: 'collectedBy',
                  value: 'salesRepUserName'
                }
              ],
              paymentId: '3',
              version: 3
            },
            {
              actions: [
                {
                  action: 'transitionState',
                  state: {
                    key: 'PaymentCancelled',
                    typeId: 'state'
                  }
                }
              ],
              paymentId: 'payment-pending',
              version: 1
            }
          ]
        });
      });

      afterAll(() => {
        Object.values(spy).forEach(method => method.mockRestore());
      });
    });
  });
});
