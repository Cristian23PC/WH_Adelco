const mockOrdersRepository = {
  find: jest.fn(() => Promise.resolve({ results: [{ id: 'order-id' }] })),
  create: jest.fn(({ body }: { body: OrderFromCartDraft }) => {
    switch (body.orderNumber) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The CustomObject with ID '(container,error)' was not found.",
            errors: [
              {
                code: 'InvalidSubject',
                message: "The CustomObject with ID '(container,error)' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve(mockOrderResponse);
    }
  }),
  getById: jest.fn((ID: string) => {
    switch (ID) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The Resource with ID 'error' was not found.",
            errors: [
              {
                code: 'ResourceNotFound',
                message: "The Resource with ID 'error' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve(mockOrderResponse);
    }
  }),
  updateById: jest.fn((ID: string) => {
    switch (ID) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The Resource with ID 'error' was not found.",
            errors: [
              {
                code: 'ResourceNotFound',
                message: "The Resource with ID 'error' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve(mockOrderResponse);
    }
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  OrdersRepository: jest.fn().mockImplementation(() => mockOrdersRepository)
}));

const mockNotificationsService = {
  sendNotification: jest.fn().mockImplementation(() => Promise.resolve())
};

jest.mock('@/notifications', () => ({
  NotificationsService: jest.fn().mockImplementation(() => mockNotificationsService)
}));

const mockPaymentsService = {
  update: jest.fn().mockImplementation(() => Promise.resolve(mockPaymentResponse))
};

jest.mock('@/payments/payments.service', () => ({
  PaymentsService: jest.fn().mockImplementation(() => mockPaymentsService)
}));

const mockCreditNotesService = {
  update: jest.fn().mockImplementation(() => Promise.resolve(creditNotesMock)),
  getByCreditNotesKeys: jest.fn().mockImplementation(() => Promise.resolve([creditNotesMock]))
};

jest.mock('@/credit-notes/credit-notes.service', () => ({
  CreditNotesService: jest.fn().mockImplementation(() => mockCreditNotesService)
}));

const mockOrderHelperService = {
  handleCollectPayments: jest.fn(() => ({
    orderActions: [
      {
        actions: [
          { action: 'removePayment' },
          { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'paymentInfo' },
          ,
          { action: 'setDeliveryCustomField', deliveryId: 'deliveryId2', name: 'owedAmount' }
        ]
      }
    ],
    paymentActions: [{}],
    creditNotesActions: [creditNotesMock]
  })),
  formatDeliveries: jest.fn(),
  combineCreditNotesAndPayments: jest.fn()
};

jest.mock('@/orders-helper/orders-helper.service', () => ({
  OrdersHelperService: jest.fn().mockImplementation(() => mockOrderHelperService)
}));

jest.useFakeTimers().setSystemTime(new Date('2023-10-01'));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { Delivery, Order, OrderFromCartDraft, OrderTransitionLineItemStateAction, OrderUpdate, Payment, PaymentReference, PaymentUpdate } from '@commercetools/platform-sdk';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { OrdersRepository } from 'commercetools-sdk-repositories';
import {
  mockAdelcoOrder,
  mockOrderWithMorePendingDeliveries,
  mockOrderFromCartDraft,
  mockOrderResponse,
  mockUpdatePaymentRequest,
  mockupdateDeliveriesRequest
} from '../__mocks__/orders.mock';
import { PaymentsService } from '@/payments/payments.service';
import { mockPaymentResponse } from '@/payments/__mocks__/payments.mocks';
import { AdelcoOrder } from '@adelco/price-calc';
import { ApiError } from '@/common/errors/api.error';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { KEY_LINE_ITEM_STATE, KEY_PAYMENT_STATE } from '../orders.interface';
import { STATE_STATUS } from '@/payments/payments.interface';
import { DELIVERY_STATUS } from '../enum/orders.enum';
import { PAYMENT_METHOD } from '@/payments/enum/payment.enum';
import { NotificationsService } from '@/notifications';
import { OrdersHelperService } from '@/orders-helper/orders-helper.service';
import { CollectPaymentsDtoRequest } from '../dto/collect-payments.dto';
import { CreditNotesService } from '@/credit-notes/credit-notes.service';
import { creditNotesMock } from '@/credit-notes/__mocks__/credit-notes.mock';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService, OrdersRepository, PaymentsService, NotificationsService, OrdersHelperService, CreditNotesService]
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('getByDteNumbers', () => {
    let response: CommercetoolsError | Order[];
    const mockKeys = ['key1', 'key2'];

    describe('when method executes successfully', () => {
      beforeEach(async () => {
        response = await service.getByDteNumbers(mockKeys);
      });

      it('should call find form ordersRepository', () => {
        expect(mockOrdersRepository.find).toHaveBeenCalledWith({
          queryArgs: { where: `shippingInfo(deliveries(custom(fields(dteNumber in ("${mockKeys.join('","')}")))))`, expand: ['paymentInfo.payments[*].paymentStatus.state'] }
        });
      });

      it('should return the updated orders', () => {
        expect(response).toEqual([{ id: 'order-id' }]);
      });
    });

    describe('when error', () => {
      beforeEach(async () => {
        mockOrdersRepository.find.mockResolvedValueOnce({ results: [] });
        try {
          await service.getByDteNumbers(mockKeys);
        } catch (error) {
          response = error;
        }
      });

      it('should throw an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('ordersNotFound', JSON.stringify(mockKeys)));
      });
    });
  });

  describe('collectPayments', () => {
    let getByDteNumbersSpy: jest.SpyInstance<any>;
    let updateOrderSpy: jest.SpyInstance<any>;
    let response: CommercetoolsError | { orders: Order[]; payments: Payment[] };
    const mockCollectPaymentsDto: CollectPaymentsDtoRequest = {} as CollectPaymentsDtoRequest;

    describe('when method executes successfully', () => {
      beforeEach(async () => {
        mockPaymentsService.update.mockResolvedValueOnce({ id: 'payment-updated', paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.PAID } } } });
        getByDteNumbersSpy = jest.spyOn(OrdersService.prototype, 'getByDteNumbers');
        updateOrderSpy = jest.spyOn(OrdersService.prototype, 'update');
        updateOrderSpy.mockResolvedValue({ id: 'order-updated' });
        getByDteNumbersSpy.mockResolvedValue([]);
        response = await service.collectPayments(mockCollectPaymentsDto, 'salesRepId');
      });

      it('should call getByDteNumbers', () => {
        expect(service.getByDteNumbers).toHaveBeenCalledWith(mockCollectPaymentsDto.invoices);
      });

      it('should call OrdersHelperService methods', () => {
        expect(mockOrderHelperService.handleCollectPayments).toHaveBeenCalled();
      });

      it('should call notifactionService 3 times', () => {
        expect(mockNotificationsService.sendNotification).toHaveBeenCalledTimes(3);
      });

      it('should return the updated orders, payments and creditNotes', () => {
        expect(response).toEqual({
          orders: [{ id: 'order-updated' }],
          creditNotes: [creditNotesMock],
          payments: [
            {
              id: 'payment-updated',
              paymentStatus: {
                state: {
                  obj: {
                    key: 'PaymentPaid'
                  }
                }
              }
            }
          ]
        });
      });
    });

    afterAll(() => {
      getByDteNumbersSpy.mockRestore();
      updateOrderSpy.mockRestore();
    });
  });

  describe('create', () => {
    let response: CommercetoolsError | Order;

    describe('when OrdersRepository.create succeeds', () => {
      beforeEach(async () => {
        response = await service.create(mockOrderFromCartDraft);
      });

      it('should call OrdersRepository.create', () => {
        expect(mockOrdersRepository.create).toHaveBeenCalledWith({ body: mockOrderFromCartDraft, queryArgs: { expand: ['paymentInfo.payments[*]'] } });
      });

      it('should return OrdersRepository.create response', () => {
        expect(response).toEqual(mockOrderResponse);
      });
    });

    describe('when OrdersRepository.create rejects', () => {
      beforeEach(async () => {
        try {
          await service.create({ ...mockOrderFromCartDraft, orderNumber: 'error' });
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call OrdersRepository.create', () => {
        expect(mockOrdersRepository.create).toHaveBeenCalledWith({ body: { ...mockOrderFromCartDraft, orderNumber: 'error' }, queryArgs: { expand: ['paymentInfo.payments[*]'] } });
      });

      it('should throw OrdersRepository.create error', () => {
        expect(response).toEqual(
          new CommercetoolsError({
            statusCode: 404,
            message: "The CustomObject with ID '(container,error)' was not found.",
            errors: [
              {
                code: 'InvalidSubject',
                message: "The CustomObject with ID '(container,error)' was not found."
              }
            ]
          })
        );
      });
    });
  });

  describe('getById', () => {
    let response: CommercetoolsError | Order;

    describe('when OrdersRepository.getById succeeds', () => {
      beforeEach(async () => {
        response = await service.getById('orderId');
      });

      it('should call OrdersRepository.getById', () => {
        expect(mockOrdersRepository.getById).toHaveBeenCalledWith('orderId', undefined);
      });

      it('should return OrdersRepository.getById response', () => {
        expect(response).toEqual(mockOrderResponse);
      });
    });

    describe('when OrdersRepository.getById rejects', () => {
      beforeEach(async () => {
        try {
          await service.getById('error');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call OrdersRepository.getById', () => {
        expect(mockOrdersRepository.getById).toHaveBeenCalledWith('error', undefined);
      });

      it('should throw OrdersRepository.getById error', () => {
        expect(response).toEqual(
          new CommercetoolsError({
            statusCode: 404,
            message: "The Resource with ID 'error' was not found.",
            errors: [
              {
                code: 'ResourceNotFound',
                message: "The Resource with ID 'error' was not found."
              }
            ]
          })
        );
      });
    });
  });

  describe('update', () => {
    let response: CommercetoolsError | Order;

    describe('when OrdersRepository.updateById succeeds', () => {
      beforeEach(async () => {
        response = await service.update('orderId', { version: 1, actions: [{ action: 'changePaymentState', paymentState: 'Paid' }] });
      });

      it('should call OrdersRepository.updateById', () => {
        expect(mockOrdersRepository.updateById).toHaveBeenCalledWith('orderId', {
          body: { actions: [{ action: 'changePaymentState', paymentState: 'Paid' }], version: 1 },
          queryArgs: {
            expand: ['paymentInfo.payments[*].paymentStatus.state']
          }
        });
      });

      it('should return OrdersRepository.updateById response', () => {
        expect(response).toEqual(mockOrderResponse);
      });
    });

    describe('when OrdersRepository.updateById rejects', () => {
      beforeEach(async () => {
        try {
          await service.update('error', { version: 1, actions: [{ action: 'changePaymentState', paymentState: 'Paid' }] });
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call OrdersRepository.updateById', () => {
        expect(mockOrdersRepository.updateById).toHaveBeenCalledWith('error', {
          body: { actions: [{ action: 'changePaymentState', paymentState: 'Paid' }], version: 1 },
          queryArgs: {
            expand: ['paymentInfo.payments[*].paymentStatus.state']
          }
        });
      });

      it('should throw OrdersRepository.updateById error', () => {
        expect(response).toEqual(
          new CommercetoolsError({
            statusCode: 404,
            message: "The Resource with ID 'error' was not found.",
            errors: [
              {
                code: 'ResourceNotFound',
                message: "The Resource with ID 'error' was not found."
              }
            ]
          })
        );
      });
    });
  });

  describe('buildPaymentUpdateAction', () => {
    let response: PaymentUpdate;

    it('shoul build correct actions', () => {
      response = service['buildPaymentUpdateAction'](mockUpdatePaymentRequest, mockPaymentResponse, mockOrderResponse.shippingInfo.deliveries[0], 'truckDriverId');
      expect(response).toEqual({
        actions: [
          {
            action: 'setCustomField',
            name: 'collectedBy',
            value: 'truckDriverId'
          },
          {
            action: 'changeAmountPlanned',
            amount: {
              centAmount: 123123,
              currencyCode: 'CLP'
            }
          },
          {
            action: 'setCustomField',
            name: 'transportDocumentId',
            value: 'transportDocumentId'
          },
          {
            action: 'setCustomField',
            name: 'paymentDate',
            value: '2023-10-01'
          },
          {
            action: 'setCustomField',
            name: 'carrierRUT',
            value: 'carrierRUT'
          },
          {
            action: 'setCustomField',
            name: 'associatedDocs',
            value:
              '[{"documentId":"documentId","dteType":"dteType","dteNumber":"dteNumber","dteDate":"dteDate","sapDocumentId":"sapDocumentId","amount":123123,"isPartial":false,"carrierRUT":"carrierRUT"}]'
          },
          {
            action: 'transitionState',
            state: {
              key: 'PaymentPaid',
              typeId: 'state'
            }
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Cash'
          },
          {
            action: 'setCustomField',
            name: 'extraInfo',
            value: 'extra info'
          }
        ],
        version: 1
      });
    });

    it('shoul build correct actions with some undefined values', () => {
      response = service['buildPaymentUpdateAction'](
        mockUpdatePaymentRequest,
        mockPaymentResponse,
        {
          ...mockOrderResponse.shippingInfo.deliveries[0],
          custom: { fields: {} } as any
        },
        'truckDriverId'
      );
      expect(response).toEqual({
        actions: [
          {
            action: 'setCustomField',
            name: 'collectedBy',
            value: 'truckDriverId'
          },
          {
            action: 'changeAmountPlanned',
            amount: {
              centAmount: 123123,
              currencyCode: 'CLP'
            }
          },
          {
            action: 'setCustomField',
            name: 'paymentDate',
            value: '2023-10-01'
          },
          {
            action: 'setCustomField',
            name: 'associatedDocs',
            value: '[{"documentId":"documentId","amount":123123,"isPartial":false}]'
          },
          {
            action: 'transitionState',
            state: {
              key: 'PaymentPaid',
              typeId: 'state'
            }
          },
          {
            action: 'setMethodInfoMethod',
            method: 'Cash'
          },
          {
            action: 'setCustomField',
            name: 'extraInfo',
            value: 'extra info'
          }
        ],
        version: 1
      });
    });
  });

  describe('updatePayment', () => {
    let response: CommercetoolsError | AdelcoOrder | ApiError;
    let spyGetById: jest.SpyInstance;
    let spyUpdate: jest.SpyInstance;

    describe('when succeeds', () => {
      beforeEach(async () => {
        spyGetById = jest
          .spyOn(service, 'getById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockOrderResponse, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } })
          );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updatePayment('orderId', mockUpdatePaymentRequest, 'truckDriverId');
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith(
          '85f70fc1-47fc-4bd5-bf29-48daf2387625',
          {
            actions: [
              {
                action: 'setCustomField',
                name: 'collectedBy',
                value: 'truckDriverId'
              },
              { action: 'changeAmountPlanned', amount: { centAmount: 123123, currencyCode: 'CLP' } },
              {
                action: 'setCustomField',
                name: 'transportDocumentId',
                value: 'transportDocumentId'
              },
              {
                action: 'setCustomField',
                name: 'paymentDate',
                value: '2023-10-01'
              },
              {
                action: 'setCustomField',
                name: 'carrierRUT',
                value: 'carrierRUT'
              },
              {
                action: 'setCustomField',
                name: 'associatedDocs',
                value:
                  '[{"documentId":"documentId","dteType":"dteType","dteNumber":"dteNumber","dteDate":"dteDate","sapDocumentId":"sapDocumentId","amount":123123,"isPartial":false,"carrierRUT":"carrierRUT"}]'
              },
              { action: 'transitionState', state: { key: KEY_PAYMENT_STATE.PAID, typeId: 'state' } },
              { action: 'setMethodInfoMethod', method: 'Cash' },
              { action: 'setCustomField', name: 'extraInfo', value: 'extra info' }
            ],
            version: 1
          },
          { expand: ['paymentStatus.state'] }
        );
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'changePaymentState', paymentState: 'BalanceDue' },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 0,
                currencyCode: 'CLP'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when already paid', () => {
      const paidPayment: PaymentReference = {
        typeId: 'payment',
        id: '85f70fc1-47fc-4bd5-bf29-48daf2387625',
        obj: { version: 1, paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.PAID } } } }
      } as unknown as PaymentReference;
      const modifiedOrder: Order = { ...mockOrderResponse, paymentInfo: { payments: [paidPayment] } };

      beforeEach(async () => {
        spyGetById = jest.spyOn(service, 'getById').mockImplementation(() => Promise.resolve(modifiedOrder));
        response = await service.updatePayment('already-paid', mockUpdatePaymentRequest, 'truckDriverId');
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('already-paid', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should not call PaymentService.update', () => {
        expect(mockPaymentsService.update).not.toHaveBeenCalled();
      });

      it('should not call service.update', () => {
        expect(spyUpdate).not.toHaveBeenCalled();
      });
    });

    describe('when succeeds and owedAmount exist', () => {
      beforeEach(async () => {
        spyGetById = jest.spyOn(service, 'getById').mockImplementation(() =>
          Promise.resolve({
            ...mockOrderResponse,
            shippingInfo: {
              deliveries: [
                {
                  ...mockOrderResponse.shippingInfo.deliveries[0],
                  custom: {
                    ...mockOrderResponse.shippingInfo.deliveries[0].custom,
                    fields: { ...mockOrderResponse.shippingInfo.deliveries[0].custom.fields, owedAmount: { centAmount: 123623, currencyCode: 'CLP' } }
                  }
                }
              ]
            },
            paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] }
          } as unknown as Order)
        );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updatePayment('orderId', mockUpdatePaymentRequest, 'truckDriverId');
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith(
          '85f70fc1-47fc-4bd5-bf29-48daf2387625',
          {
            actions: [
              {
                action: 'setCustomField',
                name: 'collectedBy',
                value: 'truckDriverId'
              },
              { action: 'changeAmountPlanned', amount: { centAmount: 123123, currencyCode: 'CLP' } },
              {
                action: 'setCustomField',
                name: 'transportDocumentId',
                value: 'transportDocumentId'
              },
              {
                action: 'setCustomField',
                name: 'paymentDate',
                value: '2023-10-01'
              },
              {
                action: 'setCustomField',
                name: 'carrierRUT',
                value: 'carrierRUT'
              },
              {
                action: 'setCustomField',
                name: 'associatedDocs',
                value:
                  '[{"documentId":"documentId","dteType":"dteType","dteNumber":"dteNumber","dteDate":"dteDate","sapDocumentId":"sapDocumentId","amount":123123,"isPartial":true,"carrierRUT":"carrierRUT"}]'
              },
              { action: 'transitionState', state: { key: KEY_PAYMENT_STATE.PAID, typeId: 'state' } },
              { action: 'setMethodInfoMethod', method: 'Cash' },
              { action: 'setCustomField', name: 'extraInfo', value: 'extra info' }
            ],
            version: 1
          },
          { expand: ['paymentStatus.state'] }
        );
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'changePaymentState', paymentState: 'BalanceDue' },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 500,
                currencyCode: 'CLP'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds and is PAYMENT_METHOD.CREDIT_CARD', () => {
      beforeEach(async () => {
        spyGetById = jest
          .spyOn(service, 'getById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockOrderResponse, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } })
          );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updatePayment('orderId', { ...mockUpdatePaymentRequest, method: PAYMENT_METHOD.CREDIT_CARD }, 'truckDriverId');
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith(
          '85f70fc1-47fc-4bd5-bf29-48daf2387625',
          {
            actions: [
              {
                action: 'setCustomField',
                name: 'collectedBy',
                value: 'truckDriverId'
              },
              { action: 'changeAmountPlanned', amount: { centAmount: 123123, currencyCode: 'CLP' } },
              {
                action: 'setCustomField',
                name: 'transportDocumentId',
                value: 'transportDocumentId'
              },
              {
                action: 'setCustomField',
                name: 'paymentDate',
                value: '2023-10-01'
              },
              {
                action: 'setCustomField',
                name: 'carrierRUT',
                value: 'carrierRUT'
              },
              {
                action: 'setCustomField',
                name: 'associatedDocs',
                value:
                  '[{"documentId":"documentId","dteType":"dteType","dteNumber":"dteNumber","dteDate":"dteDate","sapDocumentId":"sapDocumentId","amount":123123,"isPartial":false,"carrierRUT":"carrierRUT"}]'
              },
              { action: 'transitionState', state: { key: KEY_PAYMENT_STATE.PAID, typeId: 'state' } },
              { action: 'setMethodInfoMethod', method: 'CreditCard' },
              { action: 'setCustomField', name: 'extraInfo', value: 'extra info' },
              {
                action: 'setCustomField',
                name: 'trxNumber',
                value: 'trxNumber'
              }
            ],
            version: 1
          },
          { expand: ['paymentStatus.state'] }
        );
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'changePaymentState', paymentState: 'BalanceDue' },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 0,
                currencyCode: 'CLP'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds and is PAYMENT_METHOD.DEBIT_CARD', () => {
      beforeEach(async () => {
        spyGetById = jest
          .spyOn(service, 'getById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockOrderResponse, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } })
          );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updatePayment('orderId', { ...mockUpdatePaymentRequest, method: PAYMENT_METHOD.DEBIT_CARD }, 'truckDriverId');
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith(
          '85f70fc1-47fc-4bd5-bf29-48daf2387625',
          {
            actions: [
              {
                action: 'setCustomField',
                name: 'collectedBy',
                value: 'truckDriverId'
              },
              { action: 'changeAmountPlanned', amount: { centAmount: 123123, currencyCode: 'CLP' } },
              {
                action: 'setCustomField',
                name: 'transportDocumentId',
                value: 'transportDocumentId'
              },
              {
                action: 'setCustomField',
                name: 'paymentDate',
                value: '2023-10-01'
              },
              {
                action: 'setCustomField',
                name: 'carrierRUT',
                value: 'carrierRUT'
              },
              {
                action: 'setCustomField',
                name: 'associatedDocs',
                value:
                  '[{"documentId":"documentId","dteType":"dteType","dteNumber":"dteNumber","dteDate":"dteDate","sapDocumentId":"sapDocumentId","amount":123123,"isPartial":false,"carrierRUT":"carrierRUT"}]'
              },
              { action: 'transitionState', state: { key: KEY_PAYMENT_STATE.PAID, typeId: 'state' } },
              { action: 'setMethodInfoMethod', method: 'DebitCard' },
              { action: 'setCustomField', name: 'extraInfo', value: 'extra info' },
              {
                action: 'setCustomField',
                name: 'trxNumber',
                value: 'trxNumber'
              }
            ],
            version: 1
          },
          { expand: ['paymentStatus.state'] }
        );
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'changePaymentState', paymentState: 'BalanceDue' },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 0,
                currencyCode: 'CLP'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds and is PAYMENT_METHOD.DAY_CHECK', () => {
      let dateSpy: jest.SpyInstance;

      beforeAll(() => {
        dateSpy = jest.spyOn(global.Date.prototype, 'toISOString').mockReturnValue('2023-08-28T00:00:00Z');
      });

      afterAll(() => {
        dateSpy.mockRestore();
      });

      beforeEach(async () => {
        spyGetById = jest
          .spyOn(service, 'getById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockOrderResponse, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } })
          );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updatePayment('orderId', { ...mockUpdatePaymentRequest, method: PAYMENT_METHOD.DAY_CHECK }, 'truckDriverId');
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith(
          '85f70fc1-47fc-4bd5-bf29-48daf2387625',
          {
            actions: [
              {
                action: 'setCustomField',
                name: 'collectedBy',
                value: 'truckDriverId'
              },
              { action: 'changeAmountPlanned', amount: { centAmount: 123123, currencyCode: 'CLP' } },
              {
                action: 'setCustomField',
                name: 'transportDocumentId',
                value: 'transportDocumentId'
              },
              {
                action: 'setCustomField',
                name: 'paymentDate',
                value: '2023-08-28'
              },
              {
                action: 'setCustomField',
                name: 'carrierRUT',
                value: 'carrierRUT'
              },
              {
                action: 'setCustomField',
                name: 'associatedDocs',
                value:
                  '[{"documentId":"documentId","dteType":"dteType","dteNumber":"dteNumber","dteDate":"dteDate","sapDocumentId":"sapDocumentId","amount":123123,"isPartial":false,"carrierRUT":"carrierRUT"}]'
              },
              { action: 'transitionState', state: { key: KEY_PAYMENT_STATE.PAID, typeId: 'state' } },
              { action: 'setMethodInfoMethod', method: 'DayCheck' },
              { action: 'setCustomField', name: 'extraInfo', value: 'extra info' },
              {
                action: 'setCustomField',
                name: 'checkNumber',
                value: 'checkNumber'
              },
              {
                action: 'setCustomField',
                name: 'checkExpirationDate',
                value: '2023-08-28T00:00:00Z'
              }
            ],
            version: 1
          },
          { expand: ['paymentStatus.state'] }
        );
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'changePaymentState', paymentState: 'BalanceDue' },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 0,
                currencyCode: 'CLP'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds and is PAYMENT_METHOD.BANK_TRANSFER', () => {
      beforeEach(async () => {
        spyGetById = jest
          .spyOn(service, 'getById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockOrderResponse, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } })
          );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updatePayment('orderId', { ...mockUpdatePaymentRequest, method: PAYMENT_METHOD.BANK_TRANSFER }, 'truckDriverId');
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith(
          '85f70fc1-47fc-4bd5-bf29-48daf2387625',
          {
            actions: [
              {
                action: 'setCustomField',
                name: 'collectedBy',
                value: 'truckDriverId'
              },
              {
                action: 'changeAmountPlanned',
                amount: {
                  centAmount: 123123,
                  currencyCode: 'CLP'
                }
              },
              {
                action: 'setCustomField',
                name: 'transportDocumentId',
                value: 'transportDocumentId'
              },
              {
                action: 'setCustomField',
                name: 'paymentDate',
                value: '2023-10-01'
              },
              {
                action: 'setCustomField',
                name: 'carrierRUT',
                value: 'carrierRUT'
              },
              {
                action: 'setCustomField',
                name: 'associatedDocs',
                value:
                  '[{"documentId":"documentId","dteType":"dteType","dteNumber":"dteNumber","dteDate":"dteDate","sapDocumentId":"sapDocumentId","amount":123123,"isPartial":false,"carrierRUT":"carrierRUT"}]'
              },
              {
                action: 'transitionState',
                state: {
                  key: 'PaymentPaid',
                  typeId: 'state'
                }
              },
              {
                action: 'setMethodInfoMethod',
                method: 'BankTransfer'
              },
              {
                action: 'setCustomField',
                name: 'extraInfo',
                value: 'extra info'
              },
              {
                action: 'setCustomField',
                name: 'transferNumber',
                value: 'transferNumber'
              },
              {
                action: 'setCustomField',
                name: 'bankCode',
                value: 'bankCode'
              },
              {
                action: 'setCustomField',
                name: 'accountNumber',
                value: 'accountNumber'
              }
            ],
            version: 1
          },
          { expand: ['paymentStatus.state'] }
        );
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'changePaymentState', paymentState: 'BalanceDue' },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 0,
                currencyCode: 'CLP'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds and payment is in Pending', () => {
      beforeEach(async () => {
        spyGetById = jest.spyOn(service, 'getById').mockImplementation(() =>
          Promise.resolve({
            ...mockOrderResponse,
            paymentInfo: {
              payments: [
                {
                  typeId: 'payment',
                  id: 'newPaymentId',
                  obj: {
                    ...mockPaymentResponse,
                    paymentStatus: { state: { ...mockPaymentResponse.paymentStatus.state, obj: { ...mockPaymentResponse.paymentStatus.state.obj, key: STATE_STATUS.PENDING } } }
                  }
                }
              ]
            }
          } as unknown as Order)
        );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updatePayment('orderId', { ...mockUpdatePaymentRequest, paymentId: 'newPaymentId' }, 'truckDriverId');
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith(
          '85f70fc1-47fc-4bd5-bf29-48daf2387625',
          {
            actions: [
              {
                action: 'setCustomField',
                name: 'collectedBy',
                value: 'truckDriverId'
              },
              {
                action: 'changeAmountPlanned',
                amount: {
                  centAmount: 123123,
                  currencyCode: 'CLP'
                }
              },
              {
                action: 'setCustomField',
                name: 'transportDocumentId',
                value: 'transportDocumentId'
              },
              {
                action: 'setCustomField',
                name: 'paymentDate',
                value: '2023-10-01'
              },
              {
                action: 'setCustomField',
                name: 'carrierRUT',
                value: 'carrierRUT'
              },
              {
                action: 'setCustomField',
                name: 'associatedDocs',
                value:
                  '[{"documentId":"documentId","dteType":"dteType","dteNumber":"dteNumber","dteDate":"dteDate","sapDocumentId":"sapDocumentId","amount":123123,"isPartial":false,"carrierRUT":"carrierRUT"}]'
              },
              {
                action: 'transitionState',
                state: {
                  key: 'PaymentPaid',
                  typeId: 'state'
                }
              },
              {
                action: 'setMethodInfoMethod',
                method: 'Cash'
              },
              {
                action: 'setCustomField',
                name: 'extraInfo',
                value: 'extra info'
              }
            ],
            version: 1
          },
          { expand: ['paymentStatus.state'] }
        );
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'changePaymentState', paymentState: 'BalanceDue' },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 0,
                currencyCode: 'CLP'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when paymentId send is not find it in the orden', () => {
      beforeEach(async () => {
        spyGetById = jest.spyOn(service, 'getById').mockImplementation(() =>
          Promise.resolve({
            ...mockOrderResponse,
            paymentInfo: {
              payments: []
            }
          })
        );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        try {
          response = await service.updatePayment('orderId', mockUpdatePaymentRequest, 'truckDriverId');
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state'] } });
      });

      it('should not call PaymentService.update', () => {
        expect(mockPaymentsService.update).not.toHaveBeenCalled();
      });

      it('should not call service.update', () => {
        expect(spyUpdate).not.toHaveBeenCalled();
      });

      it('should throw an ApiError', () => {
        expect(response).toEqual(ErrorBuilder.buildError('paymentNotAssociated'));
      });
    });
  });

  describe('buildPositionsMappingSetDeliveryCustomField', () => {
    const delivery: Delivery = {
      custom: {
        fields: { positionsMapping: '[{"id":"acf3ed0d-87f2-4047-9e09-ae12b1e48b61","pos":"10"}]' },
        type: {
          typeId: 'type',
          id: 'type-id'
        }
      }
    } as any;

    const noDeliveredItems = [
      {
        lineItemCtId: 'acf3ed0d-87f2-4047-9e09-ae12b1e48b61',
        quantity: 10
      }
    ];

    it('should return action to update positions mapping', async () => {
      expect(service['buildPositionsMappingSetDeliveryCustomField']('deliveryId', delivery, noDeliveredItems)).toStrictEqual([
        {
          action: 'setDeliveryCustomField',
          deliveryId: 'deliveryId',
          name: 'positionsMapping',
          value: '[{"id":"acf3ed0d-87f2-4047-9e09-ae12b1e48b61","pos":"10","notDeliveredQuantity":10}]'
        }
      ]);
    });

    it('should return an empty array', async () => {
      expect(service['buildPositionsMappingSetDeliveryCustomField']('deliveryId', delivery, [])).toStrictEqual([]);
    });

    it('should return an empty array', async () => {
      expect(service['buildPositionsMappingSetDeliveryCustomField']('deliveryId', { ...delivery, custom: { fields: {} } as any }, noDeliveredItems)).toStrictEqual([]);
    });
  });

  describe('updatePositionsMappingToClean', () => {
    const delivery: Delivery = {
      custom: {
        fields: {
          positionsMapping: '[{"id":"acf3ed0d-87f2-4047-9e09-ae12b1e48b61","pos":"10", "notDeliveredQuantity":10}]',
          noDeliveryReason: '502'
        },
        type: {
          typeId: 'type',
          id: 'type-id'
        }
      }
    } as any;

    const noDeliveredItems = undefined;

    it('should return action to update positions mapping', async () => {
      expect(service['buildPositionsMappingSetDeliveryCustomField']('deliveryId', delivery, noDeliveredItems)).toStrictEqual([
        {
          action: 'setDeliveryCustomField',
          deliveryId: 'deliveryId',
          name: 'positionsMapping',
          value: '[{"id":"acf3ed0d-87f2-4047-9e09-ae12b1e48b61","pos":"10"}]'
        }
      ]);
    });
  });

  describe('doNotUpdatePositionsMappingIfNoChanges', () => {
    const delivery: Delivery = {
      custom: {
        fields: {
          positionsMapping: '[{"id":"acf3ed0d-87f2-4047-9e09-ae12b1e48b61","pos":"10"}]',
          noDeliveryReason: '502'
        },
        type: {
          typeId: 'type',
          id: 'type-id'
        }
      }
    } as any;

    const noDeliveredItems = undefined;

    it('should return action to update positions mapping', async () => {
      expect(service['buildPositionsMappingSetDeliveryCustomField']('deliveryId', delivery, noDeliveredItems)).toStrictEqual([]);
    });
  });

  describe('updateDeliveries', () => {
    let response: AdelcoOrder;
    let spyGetById: jest.SpyInstance;
    let spyUpdate: jest.SpyInstance;
    let spyReversePaymentForNotDeliveredStatus: jest.SpyInstance;
    let spyReverseTransitionLineItemState: jest.SpyInstance;

    beforeAll(() => {
      spyReversePaymentForNotDeliveredStatus = jest.spyOn(service, 'reversePaymentForNotDeliveredStatus').mockImplementation();
      spyReverseTransitionLineItemState = jest.spyOn(service, 'reverseTransitionLineItemState').mockImplementation();
    });

    afterAll(() => {
      spyReversePaymentForNotDeliveredStatus.mockRestore();
      spyReverseTransitionLineItemState.mockRestore();
    });

    describe('when succeeds', () => {
      beforeEach(async () => {
        spyGetById = jest
          .spyOn(service, 'getById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockOrderResponse, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } })
          );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));
        response = await service.updateDeliveries('orderId', mockupdateDeliveriesRequest);
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state', 'lineItems[*].state[*].state'] } });
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'deliveryDate', value: '2023-08-10T00:00:00.000Z' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'state', value: 'Partial' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'noDeliveryReason', value: '513' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'lat', value: 123 },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'long', value: 123 },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'deliveryTotalAmount',
              value: {
                centAmount: 2,
                currencyCode: 'CLP'
              }
            },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 2,
                currencyCode: 'CLP'
              }
            },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'positionsMapping',
              value: '[{"id":"item1","pos":"10","notDeliveredQuantity":50},{"id":"item2","pos":"20","notDeliveredQuantity":5}]'
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: KEY_LINE_ITEM_STATE.RETURNED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: KEY_LINE_ITEM_STATE.DELIVERED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item2',
              quantity: 5,
              toState: { key: KEY_LINE_ITEM_STATE.RETURNED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item3',
              quantity: 20,
              toState: { key: KEY_LINE_ITEM_STATE.DELIVERED, typeId: 'state' }
            },
            {
              action: 'transitionState',
              state: {
                key: 'OrderComplete',
                typeId: 'state'
              }
            }
          ],
          version: 1
        });
      });

      it('should not call the payment', () => {
        expect(mockPaymentsService.update).not.toHaveBeenCalled();
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds not delivered status', () => {
      beforeEach(async () => {
        spyGetById = jest.spyOn(service, 'getById').mockImplementation(() =>
          Promise.resolve({
            ...mockOrderResponse,
            shippingInfo: {
              ...mockOrderResponse.shippingInfo,
              deliveries: [
                {
                  ...mockOrderResponse.shippingInfo.deliveries[0],
                  custom: {
                    ...mockOrderResponse.shippingInfo.deliveries[0].custom,
                    fields: {
                      ...mockOrderResponse.shippingInfo.deliveries[0].custom.fields,
                      paymentInfo: ['85f70fc1-47fc-4bd5-bf29-48daf2387625'],
                      state: DELIVERY_STATUS.PARTIAL
                    }
                  }
                }
              ]
            },
            paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] }
          })
        );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updateDeliveries('orderId', { ...mockupdateDeliveriesRequest, status: DELIVERY_STATUS.NOT_DELIVERED });
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state', 'lineItems[*].state[*].state'] } });
      });

      it('should call reversePaymentForNotDeliveredStatus', () => {
        expect(spyReversePaymentForNotDeliveredStatus).toHaveBeenCalled();
      });
      it('should call reverseTransitionLineItemState', () => {
        expect(spyReverseTransitionLineItemState).toHaveBeenCalled();
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalled();
      });
      it('should call the payment', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith('85f70fc1-47fc-4bd5-bf29-48daf2387625', {
          actions: [{ action: 'transitionState', state: { key: 'PaymentCancelled', typeId: 'state' } }],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds but more deliveries', () => {
      beforeEach(async () => {
        spyGetById = jest
          .spyOn(service, 'getById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockOrderWithMorePendingDeliveries, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } })
          );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderWithMorePendingDeliveries));

        response = await service.updateDeliveries('orderId', mockupdateDeliveriesRequest);
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'deliveryDate', value: '2023-08-10T00:00:00.000Z' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'state', value: 'Partial' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'noDeliveryReason', value: '513' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'lat', value: 123 },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'long', value: 123 },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'deliveryTotalAmount',
              value: {
                centAmount: 2,
                currencyCode: 'CLP'
              }
            },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                centAmount: 2,
                currencyCode: 'CLP'
              }
            },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'positionsMapping',
              value: '[{"id":"item1","pos":"10","notDeliveredQuantity":50},{"id":"item2","pos":"20","notDeliveredQuantity":5}]'
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: KEY_LINE_ITEM_STATE.RETURNED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: KEY_LINE_ITEM_STATE.DELIVERED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item2',
              quantity: 5,
              toState: { key: KEY_LINE_ITEM_STATE.RETURNED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item3',
              quantity: 20,
              toState: { key: KEY_LINE_ITEM_STATE.DELIVERED, typeId: 'state' }
            }
          ],
          version: 1
        });
      });
    });

    describe('when succeeds and owedAmount', () => {
      beforeEach(async () => {
        spyGetById = jest.spyOn(service, 'getById').mockImplementation(() =>
          Promise.resolve({
            ...mockOrderResponse,
            shippingInfo: {
              ...mockOrderResponse.shippingInfo,
              deliveries: [
                {
                  ...mockOrderResponse.shippingInfo.deliveries[0],
                  custom: {
                    ...mockOrderResponse.shippingInfo.deliveries[0].custom,
                    fields: {
                      ...mockOrderResponse.shippingInfo.deliveries[0].custom.fields,
                      paymentInfo: [mockPaymentResponse.id]
                    }
                  }
                }
              ]
            },
            paymentInfo: {
              payments: [
                {
                  typeId: 'payment',
                  id: mockPaymentResponse.id,
                  obj: {
                    ...mockPaymentResponse,
                    paymentStatus: {
                      ...mockPaymentResponse.paymentStatus,
                      state: {
                        ...mockPaymentResponse.paymentStatus.state,
                        obj: {
                          ...mockPaymentResponse.paymentStatus.state.obj,
                          key: KEY_PAYMENT_STATE.PAID
                        }
                      }
                    }
                  }
                }
              ]
            }
          })
        );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updateDeliveries('orderId', {
          ...mockupdateDeliveriesRequest,
          status: DELIVERY_STATUS.PARTIAL,
          newDeliveryTotal: { ...mockupdateDeliveriesRequest.newDeliveryTotal, totalGross: 1500 }
        });
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state', 'lineItems[*].state[*].state'] } });
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'deliveryDate', value: '2023-08-10T00:00:00.000Z' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'state', value: DELIVERY_STATUS.PARTIAL },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'noDeliveryReason', value: '513' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'lat', value: 123 },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'long', value: 123 },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'deliveryTotalAmount',
              value: {
                centAmount: 1500,
                currencyCode: 'CLP'
              }
            },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                currencyCode: 'CLP',
                centAmount: 168
              }
            },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'positionsMapping',
              value: '[{"id":"item1","pos":"10","notDeliveredQuantity":50},{"id":"item2","pos":"20","notDeliveredQuantity":5}]'
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: KEY_LINE_ITEM_STATE.RETURNED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: KEY_LINE_ITEM_STATE.DELIVERED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item2',
              quantity: 5,
              toState: { key: KEY_LINE_ITEM_STATE.RETURNED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item3',
              quantity: 20,
              toState: { key: KEY_LINE_ITEM_STATE.DELIVERED, typeId: 'state' }
            },
            {
              action: 'transitionState',
              state: {
                key: 'OrderComplete',
                typeId: 'state'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds and all deliveries is in NotDelivered status', () => {
      beforeEach(async () => {
        spyGetById = jest.spyOn(service, 'getById').mockImplementation(() =>
          Promise.resolve({
            ...mockOrderResponse,
            paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] }
          })
        );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updateDeliveries('orderId', { ...mockupdateDeliveriesRequest, status: DELIVERY_STATUS.NOT_DELIVERED });
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state', 'lineItems[*].state[*].state'] } });
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'deliveryDate', value: '2023-08-10T00:00:00.000Z' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'state', value: DELIVERY_STATUS.NOT_DELIVERED },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'noDeliveryReason', value: '513' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'lat', value: 123 },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'long', value: 123 },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'deliveryTotalAmount', value: { centAmount: 0, currencyCode: 'CLP' } },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                currencyCode: 'CLP',
                centAmount: 0
              }
            },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'positionsMapping',
              value: '[{"id":"item1","pos":"10","notDeliveredQuantity":50},{"id":"item2","pos":"20","notDeliveredQuantity":5}]'
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: KEY_LINE_ITEM_STATE.RETURNED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: KEY_LINE_ITEM_STATE.DELIVERED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item2',
              quantity: 5,
              toState: { key: KEY_LINE_ITEM_STATE.RETURNED, typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: KEY_LINE_ITEM_STATE.SHIPPED, typeId: 'state' },
              lineItemId: 'item3',
              quantity: 20,
              toState: { key: KEY_LINE_ITEM_STATE.DELIVERED, typeId: 'state' }
            },
            {
              action: 'transitionState',
              state: {
                key: 'OrderNotDelivered',
                typeId: 'state'
              }
            }
          ],
          version: 1
        });
      });

      it('should not call the payment', () => {
        expect(mockPaymentsService.update).not.toHaveBeenCalled();
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when succeeds and not update a payment', () => {
      beforeEach(async () => {
        spyGetById = jest
          .spyOn(service, 'getById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockOrderResponse, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } })
          );
        spyUpdate = jest.spyOn(service, 'update').mockImplementation(() => Promise.resolve(mockOrderResponse));

        response = await service.updateDeliveries('orderId', { ...mockupdateDeliveriesRequest, status: DELIVERY_STATUS.PARTIAL });
      });

      afterEach(() => {
        spyGetById.mockClear();
        spyUpdate.mockClear();
      });

      it('should call service.getById', () => {
        expect(spyGetById).toHaveBeenCalledWith('orderId', { queryArgs: { expand: ['paymentInfo.payments[*].paymentStatus.state', 'lineItems[*].state[*].state'] } });
      });

      it('should call service.update', () => {
        expect(spyUpdate).toHaveBeenCalledWith('1549bce5-1190-4e75-9176-3fd9a481ce90', {
          actions: [
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'deliveryDate', value: '2023-08-10T00:00:00.000Z' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'state', value: DELIVERY_STATUS.PARTIAL },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'noDeliveryReason', value: '513' },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'lat', value: 123 },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'long', value: 123 },
            { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'deliveryTotalAmount', value: { centAmount: 2, currencyCode: 'CLP' } },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'owedAmount',
              value: {
                currencyCode: 'CLP',
                centAmount: 2
              }
            },
            {
              action: 'setDeliveryCustomField',
              deliveryId: 'deliveryId',
              name: 'positionsMapping',
              value: '[{"id":"item1","pos":"10","notDeliveredQuantity":50},{"id":"item2","pos":"20","notDeliveredQuantity":5}]'
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: 'LineItemShipped', typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: 'LineItemReturned', typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: 'LineItemShipped', typeId: 'state' },
              lineItemId: 'item1',
              quantity: 50,
              toState: { key: 'LineItemDelivered', typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: 'LineItemShipped', typeId: 'state' },
              lineItemId: 'item2',
              quantity: 5,
              toState: { key: 'LineItemReturned', typeId: 'state' }
            },
            {
              action: 'transitionLineItemState',
              fromState: { key: 'LineItemShipped', typeId: 'state' },
              lineItemId: 'item3',
              quantity: 20,
              toState: { key: 'LineItemDelivered', typeId: 'state' }
            },
            {
              action: 'transitionState',
              state: {
                key: 'OrderComplete',
                typeId: 'state'
              }
            }
          ],
          version: 1
        });
      });

      it('should return adelco order with the payment updated', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });
  });

  describe('buildNotDeliveredStatusSetDeliveryCustomField', () => {
    describe('when status is not delivered', () => {
      it('should return action to update deliveryTotalAmount and owedAmount', async () => {
        expect(service['buildNotDeliveredStatusSetDeliveryCustomField']('deliveryId', DELIVERY_STATUS.NOT_DELIVERED)).toStrictEqual([
          { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'deliveryTotalAmount', value: { centAmount: 0, currencyCode: 'CLP' } },
          { action: 'setDeliveryCustomField', deliveryId: 'deliveryId', name: 'owedAmount', value: { centAmount: 0, currencyCode: 'CLP' } }
        ]);
      });
    });
    describe('when status is other', () => {
      it('should return empty array of actions', async () => {
        expect(service['buildNotDeliveredStatusSetDeliveryCustomField']('deliveryId', DELIVERY_STATUS.PARTIAL)).toStrictEqual([]);
      });
    });
  });

  describe('updatePaymentForNotDeliveredStatus', () => {
    describe('when succeess', () => {
      const mockDelivery: Delivery = { id: 'deliveryId', custom: { fields: { paymentInfo: ['85f70fc1-47fc-4bd5-bf29-48daf2387625'] } } as any } as Delivery;
      beforeEach(async () => {
        await service.updatePaymentForNotDeliveredStatus(mockDelivery, {
          ...mockOrderResponse,
          shippingInfo: {
            ...mockOrderResponse.shippingInfo,
            deliveries: [
              {
                ...mockOrderResponse.shippingInfo.deliveries[0],
                custom: {
                  ...mockOrderResponse.shippingInfo.deliveries[0].custom,
                  fields: {
                    ...mockOrderResponse.shippingInfo.deliveries[0].custom.fields,
                    paymentInfo: ['85f70fc1-47fc-4bd5-bf29-48daf2387625']
                  }
                }
              }
            ]
          },
          paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] }
        });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).toHaveBeenCalledWith('85f70fc1-47fc-4bd5-bf29-48daf2387625', {
          actions: [{ action: 'transitionState', state: { key: 'PaymentCancelled', typeId: 'state' } }],
          version: 1
        });
      });
    });
    describe('when is not delivery in the order', () => {
      const mockDelivery: Delivery = { id: 'deliveryId' } as Delivery;

      beforeEach(async () => {
        await service.updatePaymentForNotDeliveredStatus(mockDelivery, {
          ...mockOrderResponse,
          shippingInfo: {
            ...mockOrderResponse.shippingInfo,
            deliveries: [
              {
                ...mockOrderResponse.shippingInfo.deliveries[0],
                custom: {
                  ...mockOrderResponse.shippingInfo.deliveries[0].custom,
                  fields: {
                    ...mockOrderResponse.shippingInfo.deliveries[0].custom.fields,
                    paymentInfo: ['85f70fc1-47fc-4bd5-bf29-48daf2387625']
                  }
                }
              }
            ]
          },
          paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] }
        });
      });

      it('should not call PaymentService.update', () => {
        expect(mockPaymentsService.update).not.toHaveBeenCalled();
      });
    });
    describe('when is not payment related', () => {
      const mockDelivery: Delivery = { id: 'deliveryId' } as Delivery;
      beforeEach(async () => {
        await service.updatePaymentForNotDeliveredStatus(mockDelivery, {
          ...mockOrderResponse,
          shippingInfo: {
            ...mockOrderResponse.shippingInfo,
            deliveries: [
              {
                ...mockOrderResponse.shippingInfo.deliveries[0],
                custom: {
                  ...mockOrderResponse.shippingInfo.deliveries[0].custom,
                  fields: {
                    ...mockOrderResponse.shippingInfo.deliveries[0].custom.fields,
                    paymentInfo: ['other']
                  }
                }
              }
            ]
          },
          paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] }
        });
      });

      it('should call PaymentService.update', () => {
        expect(mockPaymentsService.update).not.toHaveBeenCalled();
      });
    });
  });

  describe('reversePaymentForNotDeliveredStatus', () => {
    let result: Payment;

    const delivery: Delivery = {
      custom: {
        fields: {
          paymentInfo: ['paymentId']
        }
      }
    } as unknown as Delivery;

    const payment: Payment = {
      id: 'paymentId',
      version: 1,
      obj: { id: 'paymentId', version: 1, paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.CANCELLED } } } }
    } as unknown as Payment;

    const notCanceledPayment: Payment = { id: 'paymentId', version: 1, obj: { paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.FAILED } } } } } as unknown as Payment;
    const pendingPayment: Payment = { id: 'paymentId', version: 1, obj: { paymentStatus: { state: { obj: { key: KEY_PAYMENT_STATE.PENDING } } } } } as unknown as Payment;

    const order: Order = {
      paymentInfo: {
        payments: [payment]
      }
    } as unknown as Order;

    beforeEach(async () => {
      mockPaymentsService.update.mockResolvedValueOnce(payment);
      result = await service.reversePaymentForNotDeliveredStatus(delivery, order);
    });

    it('should reverse payment for not delivered status', async () => {
      expect(result).toBe(payment);
    });

    it('should call update method', () => {
      expect(mockPaymentsService.update).toHaveBeenCalledWith('paymentId', {
        version: 1,
        actions: [
          {
            action: 'transitionState',
            state: {
              typeId: 'state',
              key: KEY_PAYMENT_STATE.PENDING
            }
          }
        ]
      });
    });

    it('should return undefined when not find payment ', async () => {
      expect(
        await service.reversePaymentForNotDeliveredStatus(
          {
            custom: {
              fields: {
                paymentInfo: ['other-payment']
              }
            }
          } as any,
          order
        )
      ).toBeUndefined();
    });

    it('should do nothing if payment state is pending', async () => {
      expect(
        await service.reversePaymentForNotDeliveredStatus(delivery, {
          paymentInfo: {
            payments: [pendingPayment]
          }
        } as unknown as Order)
      ).toBeUndefined();
    });

    it('should throw an "payment is not canceled" error', async () => {
      try {
        await service.reversePaymentForNotDeliveredStatus(delivery, {
          paymentInfo: {
            payments: [notCanceledPayment]
          }
        } as unknown as Order);
      } catch (error) {
        expect(error).toStrictEqual(ErrorBuilder.buildError('paymentNotCanceled'));
      }
    });
  });

  describe('reverseTransitionLineItemState', () => {
    let result: OrderUpdate;

    const delivery: Delivery = {
      items: [{ id: 'item1' }, { id: 'item2' }]
    } as unknown as Delivery;

    const order: Order = {
      version: 1,
      lineItems: [
        {
          id: 'item1',
          state: [{ quantity: 10, state: { obj: { key: KEY_LINE_ITEM_STATE.DELIVERED } } }]
        },
        {
          id: 'item2',
          state: [{ quantity: 5, state: { obj: { key: KEY_LINE_ITEM_STATE.RETURNED } } }]
        }
      ]
    } as unknown as Order;

    beforeEach(() => {
      result = service.reverseTransitionLineItemState(delivery, order);
    });

    it('should generate the correct order update actions', () => {
      const expectedActions: OrderTransitionLineItemStateAction[] = [
        {
          action: 'transitionLineItemState',
          lineItemId: 'item1',
          fromState: {
            typeId: 'state',
            key: KEY_LINE_ITEM_STATE.DELIVERED
          },
          quantity: 10,
          toState: {
            typeId: 'state',
            key: KEY_LINE_ITEM_STATE.SHIPPED
          }
        },
        {
          action: 'transitionLineItemState',
          lineItemId: 'item2',
          fromState: {
            typeId: 'state',
            key: KEY_LINE_ITEM_STATE.RETURNED
          },
          quantity: 5,
          toState: {
            typeId: 'state',
            key: KEY_LINE_ITEM_STATE.SHIPPED
          }
        }
      ];

      expect(result).toEqual({
        version: 1,
        actions: expectedActions
      });
    });
  });
});
