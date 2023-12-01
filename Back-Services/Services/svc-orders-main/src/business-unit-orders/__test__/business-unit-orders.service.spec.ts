const mockCartsService = {
  update: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockCartResponse);
  }),
  buildPaymentAndShippingMethodActions: jest.fn(() => []),
  buildSapPositionsActions: jest.fn(() => []),
  buildSetDeliveryDateActions: jest.fn(() => []),
  buildSetCreditBlockedReasonActions: jest.fn(() => []),
  getBusinessUnitCreditTerm: jest.fn(() => 30)
};

jest.mock('@/carts/carts.service', () => ({
  CartsService: jest.fn().mockImplementation(() => mockCartsService)
}));

const mockPaymentsService = {
  create: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockPaymentResponse);
  })
};

jest.mock('@/payments/payments.service', () => ({
  PaymentsService: jest.fn().mockImplementation(() => mockPaymentsService)
}));

const mockPaymentsHelperService = {
  buildPaymentDraft: jest.fn().mockImplementation(() => {
    return mockPaymentDraft;
  })
};

jest.mock('@/payments-helper/payments-helper.service', () => ({
  PaymentsHelperService: jest.fn().mockImplementation(() => mockPaymentsHelperService)
}));

const mockOrdersService = {
  create: jest.fn().mockImplementation(order => {
    if (order.paymentState === 'blockedByCredit') {
      return Promise.resolve(mockOrderBlockedByCreditResponse);
    }
    return Promise.resolve(mockOrderResponse);
  }),
  update: jest.fn().mockImplementation(() => Promise.resolve(mockOrderResponse)),
  buildSetTransitionStateAction: jest.fn()
};

jest.mock('@/orders/orders.service', () => ({
  OrdersService: jest.fn().mockImplementation(() => mockOrdersService)
}));

const mockOrdersHelperService = {
  buildOrderFromCartDraft: jest.fn().mockImplementation((_, orderCustomFields) => {
    if (orderCustomFields.customerComment === 'blockedByCredit') {
      return Promise.resolve(mockOrderBlockedByCreditFromCartDraft);
    }
    return Promise.resolve(mockOrderFromCartDraft);
  })
};

jest.mock('@/orders-helper/orders-helper.service', () => ({
  OrdersHelperService: jest.fn().mockImplementation(() => mockOrdersHelperService)
}));

const mockSvcCartsService = {
  getActiveCart: jest.fn().mockImplementation((businessUnitId: string, username: string) => {
    if (username === 'cart-invalid-stock@username.com') {
      return Promise.resolve({ ...mockGetActiveCart, cartUpdates: { isPriceUpdated: true, isQuantityUpdated: true } });
    }

    return Promise.resolve(mockGetActiveCart);
  }),
  checkAndGetDeliveryDateForCart: jest.fn().mockImplementation(() => '2023-09-07T20:18:32.252Z')
};

jest.mock('@/svc-carts/svc-carts.service', () => ({
  SvcCartsService: jest.fn().mockImplementation(() => mockSvcCartsService)
}));

const mockPaymentsMethodsService = {
  getSelectedMethod: jest.fn().mockImplementation(() => {
    return {
      key: 'Cash',
      sapPaymentCondition: 'ZD01',
      sapPaymentMethodCode: 'E'
    };
  })
};

jest.mock('@/payments-methods/payment-methods.service', () => ({
  PaymentsMethodsService: jest.fn().mockImplementation(() => mockPaymentsMethodsService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUnitOrdersService } from '../business-unit-orders.service';
import { SvcCartsService } from '@/svc-carts/svc-carts.service';
import { OrdersHelperService } from '@/orders-helper/orders-helper.service';
import { OrdersService } from '@/orders/orders.service';
import { PaymentsHelperService } from '@/payments-helper/payments-helper.service';
import { PaymentsService } from '@/payments/payments.service';
import { mockGetActiveCart } from '@/svc-carts/__mocks__/svc-carts.mock';

import {
  mockAdelcoOrder,
  mockOrderBlockedByCreditFromCartDraft,
  mockOrderBlockedByCreditResponse,
  mockOrderFromCartDraft,
  mockAdelcoOrderWithCartUpdatesOrder,
  mockOrderResponse
} from '@/orders/__mocks__/orders.mock';

import { mockPaymentDraft, mockPaymentResponse } from '@/payments/__mocks__/payments.mocks';
import { ApiError } from '@/common/errors/api.error';
import { ORDER_SOURCE } from '../enum/business-unit-orders.enum';
import { CartsService } from '@/carts/carts.service';
import { mockCartResponse } from '@/carts/__mocks__/carts.mock';
import { PAYMENT_METHOD } from '@/payments/enum/payment.enum';
import { AdelcoOrder } from '@adelco/price-calc';
import { SvcBusinessUnitsService } from '@/svc-business-units/svc-business-units.service';
import { mockGetById } from '@/svc-business-units/__mocks__/svc-business-units.mock';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';

const mockSvcBusinessUnitsService = {
  getById: jest.fn(() => Promise.resolve(mockGetById))
};

describe('BusinessUnitOrdersService', () => {
  let service: BusinessUnitOrdersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BusinessUnitOrdersService,
        SvcCartsService,
        {
          provide: SvcBusinessUnitsService,
          useValue: mockSvcBusinessUnitsService
        },
        OrdersHelperService,
        OrdersService,
        PaymentsHelperService,
        PaymentsService,
        CartsService,
        PaymentsMethodsService
      ]
    }).compile();

    service = module.get<BusinessUnitOrdersService>(BusinessUnitOrdersService);
  });

  describe('convertActiveCart', () => {
    let response: AdelcoOrder | ApiError;
    const CASH_PAYMENT_CONDITION_CODE = 'ZD01';
    const CASH_PAYMENT_METHOD_SAP_CODE = 'E';

    describe('when return AdelcoOrder successfully', () => {
      beforeEach(async () => {
        response = await service.convertActiveCart({
          businessUnitId: 'business-unit-id',
          body: { paymentMethod: PAYMENT_METHOD.CASH, source: ORDER_SOURCE.ECOMMERCE },
          username: 'username@username.com',
          roles: ['CSR']
        });
      });

      it('should call SvcCartsService.getActiveCart', () => {
        expect(mockSvcCartsService.getActiveCart).toHaveBeenCalledWith('business-unit-id', 'username@username.com', ['CSR'], true);
      });

      it('should call SvcCartsService.checkAndGetDeliveryDateForCart', () => {
        expect(mockSvcCartsService.checkAndGetDeliveryDateForCart).toHaveBeenCalled();
      });

      it('should call cartsService.buildSetCreditBlockedReasonActions', () => {
        expect(mockCartsService.buildSetCreditBlockedReasonActions).toHaveBeenCalled();
      });

      it('should call SvcBusinessUnits.getById', () => {
        expect(mockSvcBusinessUnitsService.getById).toHaveBeenCalledWith('business-unit-id', 'username@username.com', ['CSR']);
      });

      it('should call PaymentsHelperService.buildPaymentDraft', () => {
        expect(mockPaymentsHelperService.buildPaymentDraft).toHaveBeenCalledWith('Cash', mockGetActiveCart.totalDetails, 'business-unit-id');
      });

      it('should call PaymentsService.create', () => {
        expect(mockPaymentsService.create).toHaveBeenCalledWith(mockPaymentDraft);
      });

      it('should call OrdersHelperService.buildOrderFromCartDraft', () => {
        expect(mockOrdersHelperService.buildOrderFromCartDraft).toHaveBeenCalledWith(mockCartResponse, {
          customerComment: undefined,
          purchaseNumber: undefined,
          paymentCondition: CASH_PAYMENT_CONDITION_CODE,
          sapPaymentMethodCode: CASH_PAYMENT_METHOD_SAP_CODE,
          source: ORDER_SOURCE.ECOMMERCE
        });
      });

      it('should call OrdersService.create', () => {
        expect(mockOrdersService.create).toHaveBeenCalledWith(mockOrderFromCartDraft);
      });

      it('should response AdelcoOrder', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });

      it('should not call OrdersService.update', () => {
        expect(mockOrdersService.update).not.toHaveBeenCalled();
      });
    });

    describe('when cart id send it not match with the cart', () => {
      beforeEach(async () => {
        try {
          await service.convertActiveCart({
            businessUnitId: 'business-unit-id',
            body: { paymentMethod: PAYMENT_METHOD.CASH, source: ORDER_SOURCE.ECOMMERCE, cartId: 'not-match' },
            username: 'username@username.com',
            roles: ['CSR']
          });
        } catch (error) {
          response = error;
        }
      });

      it('should throw an error', () => {
        expect(response).toEqual(ErrorBuilder.buildError('cartIdNotMatch'));
      });
    });

    describe('when return AdelcoOrder blocked successfully', () => {
      beforeEach(async () => {
        response = await service.convertActiveCart({
          businessUnitId: 'business-unit-id',
          body: { paymentMethod: PAYMENT_METHOD.CASH, source: ORDER_SOURCE.ECOMMERCE, customerComment: 'blockedByCredit' },
          username: 'blockedByCredit',
          roles: ['CSR']
        });
      });

      it('should call mockOrdersService.update', () => {
        expect(mockOrdersService.update).toHaveBeenCalled();
      });
    });

    describe('when cart has invalidStockOrPrice', () => {
      describe('when force update', () => {
        beforeEach(async () => {
          response = await service.convertActiveCart(
            {
              businessUnitId: 'business-unit-id',
              body: { paymentMethod: PAYMENT_METHOD.CASH, source: ORDER_SOURCE.ECOMMERCE },
              username: 'cart-invalid-stock@username.com',
              roles: ['CSR']
            },
            true
          );
        });
        it('should call SvcCartsService.getActiveCart', () => {
          expect(mockSvcCartsService.getActiveCart).toHaveBeenCalledWith('business-unit-id', 'cart-invalid-stock@username.com', ['CSR'], true);
        });

        it('should call SvcCartsService.checkAndGetDeliveryDateForCart', () => {
          expect(mockSvcCartsService.checkAndGetDeliveryDateForCart).toHaveBeenCalled();
        });

        it('should call cartsService.buildSetCreditBlockedReasonActions', () => {
          expect(mockCartsService.buildSetCreditBlockedReasonActions).toHaveBeenCalled();
        });

        it('should call SvcBusinessUnits.getById', () => {
          expect(mockSvcBusinessUnitsService.getById).toHaveBeenCalledWith('business-unit-id', 'cart-invalid-stock@username.com', ['CSR']);
        });

        it('should call PaymentsHelperService.buildPaymentDraft', () => {
          expect(mockPaymentsHelperService.buildPaymentDraft).toHaveBeenCalledWith('Cash', mockGetActiveCart.totalDetails, 'business-unit-id');
        });

        it('should call PaymentsService.create', () => {
          expect(mockPaymentsService.create).toHaveBeenCalledWith(mockPaymentDraft);
        });

        it('should call OrdersHelperService.buildOrderFromCartDraft', () => {
          expect(mockOrdersHelperService.buildOrderFromCartDraft).toHaveBeenCalledWith(mockCartResponse, {
            customerComment: undefined,
            purchaseNumber: undefined,
            paymentCondition: CASH_PAYMENT_CONDITION_CODE,
            sapPaymentMethodCode: CASH_PAYMENT_METHOD_SAP_CODE,
            source: 'ecomm'
          });
        });

        it('should call OrdersService.create', () => {
          expect(mockOrdersService.create).toHaveBeenCalledWith(mockOrderFromCartDraft);
        });

        it('should response AdelcoOrder with cart update flags', () => {
          expect(response).toEqual(mockAdelcoOrderWithCartUpdatesOrder);
        });
      });

      describe('when not force update', () => {
        beforeEach(async () => {
          try {
            await service.convertActiveCart({
              businessUnitId: 'business-unit-id',
              body: { paymentMethod: PAYMENT_METHOD.CASH, source: ORDER_SOURCE.ECOMMERCE },
              username: 'cart-invalid-stock@username.com',
              roles: ['CSR']
            });
          } catch (e) {
            response = e;
          }
        });
        it('should call SvcCartsService.getActiveCart', () => {
          expect(mockSvcCartsService.getActiveCart).toHaveBeenCalledWith('business-unit-id', 'cart-invalid-stock@username.com', ['CSR'], true);
        });

        it('should not call PaymentsHelperService.buildPaymentDraft', () => {
          expect(mockPaymentsHelperService.buildPaymentDraft).not.toBeCalled();
        });

        it('should not call PaymentsService.create', () => {
          expect(mockPaymentsService.create).not.toBeCalled();
        });

        it('should not call OrdersHelperService.buildOrderFromCartDraft', () => {
          expect(mockOrdersHelperService.buildOrderFromCartDraft).not.toBeCalled();
        });

        it('should not call OrdersService.create', () => {
          expect(mockOrdersService.create).not.toBeCalled();
        });

        it('should response ApiError', () => {
          expect(response).toEqual(
            new ApiError({
              status: 400,
              code: 'Orders-001',
              title: 'Invalid Stock or Price',
              detail: 'Price or stock changed and the cart was updated.'
            })
          );
        });
      });
    });

    describe('when cart has minimumOrderAmount', () => {
      beforeEach(async () => {
        mockSvcBusinessUnitsService.getById.mockResolvedValueOnce({ ...mockGetById, minimumOrderAmount: { ...mockGetById.minimumOrderAmount, centAmount: 1000000 } });
        try {
          await service.convertActiveCart({
            businessUnitId: 'business-unit-id',
            body: { paymentMethod: PAYMENT_METHOD.CASH, source: ORDER_SOURCE.ECOMMERCE },
            username: 'username@username.com',
            roles: ['CSR']
          });
        } catch (e) {
          response = e;
        }
      });

      it('should call SvcCartsService.getActiveCart', () => {
        expect(mockSvcCartsService.getActiveCart).toHaveBeenCalledWith('business-unit-id', 'username@username.com', ['CSR'], true);
      });

      it('should call SvcBusinessUnits.getById', () => {
        expect(mockSvcBusinessUnitsService.getById).toHaveBeenCalledWith('business-unit-id', 'username@username.com', ['CSR']);
      });

      it('should not call PaymentsHelperService.buildPaymentDraft', () => {
        expect(mockPaymentsHelperService.buildPaymentDraft).not.toBeCalled();
      });

      it('should not call PaymentsService.create', () => {
        expect(mockPaymentsService.create).not.toBeCalled();
      });

      it('should not call OrdersHelperService.buildOrderFromCartDraft', () => {
        expect(mockOrdersHelperService.buildOrderFromCartDraft).not.toBeCalled();
      });

      it('should not call OrdersService.create', () => {
        expect(mockOrdersService.create).not.toBeCalled();
      });

      it('should response ApiError', () => {
        expect(response).toEqual(
          new ApiError({
            status: 400,
            code: 'Orders-035',
            title: 'Invalid Minimum order amount'
          })
        );
      });
    });
  });
});
