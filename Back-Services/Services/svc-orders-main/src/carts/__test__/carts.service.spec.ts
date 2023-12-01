const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'carts.shippingMethodKey':
        return 'default';
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

const mockCartsRepository = {
  updateById: jest.fn((cartsId: string) => {
    switch (cartsId) {
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
        return Promise.resolve(mockCartResponse);
    }
  })
};

const mockBusinessUnitRepository = {
  getById: jest.fn(() => mockCompanyBusinessUnit),
  getByKey: jest.fn((buKey: string) => {
    switch (buKey) {
      case 'blocked':
        return mockCompanyBusinessUnitCreditBlocked;
      default:
        return mockCompanyBusinessUnit;
    }
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CartsRepository: jest.fn().mockImplementation(() => mockCartsRepository),
  BusinessUnitRepository: jest.fn().mockImplementation(() => mockBusinessUnitRepository)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { Test, TestingModule } from '@nestjs/testing';
import { CartsRepository } from 'commercetools-sdk-repositories';
import { CartsService } from '../carts.service';
import { mockCartResponse } from '../__mocks__/carts.mock';
import { Cart, CartUpdateAction } from '@commercetools/platform-sdk';
import { mockPaymentResponse } from '@/payments/__mocks__/payments.mocks';
import { ConfigService } from '@nestjs/config';
import { COMPANY_BLOCKED, DIVISION_BLOCKED } from '@/business-unit/constants';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import {
  mockCompanyBusinessUnit,
  mockCompanyBusinessUnitCreditBlocked,
  mockDivisionBusinessUnit,
  mockDivisionBusinessUnitCreditBlocked
} from '@/business-unit/__mocks__/business-unit';

describe('CartsService', () => {
  let service: CartsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        CartsRepository,
        ConfigService,
        {
          provide: BusinessUnitsRepository,
          useValue: mockBusinessUnitRepository
        }
      ]
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  describe('update', () => {
    let response: CommercetoolsError | Cart;

    describe('when CartsRepository.update succeeds', () => {
      beforeEach(async () => {
        response = await service.update('cart-id', 1, []);
      });

      it('should call CartsRepository.updateById', () => {
        expect(mockCartsRepository.updateById).toHaveBeenCalledWith('cart-id', { body: { actions: [], version: 1 } });
      });

      it('should return CartsRepository.updateById response', () => {
        expect(response).toEqual(mockCartResponse);
      });
    });

    describe('when CartsRepository.update rejects', () => {
      beforeEach(async () => {
        try {
          await service.update('error', 1, []);
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CartsRepository.updateById', () => {
        expect(mockCartsRepository.updateById).toHaveBeenCalledWith('error', { body: { actions: [], version: 1 } });
      });

      it('should throw CartsRepository.updateById error', () => {
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

  describe('buildPaymentAndShippingMethodActions', () => {
    let response: CommercetoolsError | CartUpdateAction[];

    describe('when succees', () => {
      beforeEach(async () => {
        response = await service.buildPaymentAndShippingMethodActions(mockPaymentResponse);
      });

      it('should return payment and shipping method actions response', () => {
        expect(response).toEqual([
          { action: 'addPayment', payment: { id: '85f70fc1-47fc-4bd5-bf29-48daf2387625', typeId: 'payment' } },
          {
            action: 'setShippingMethod',
            shippingMethod: { key: 'default', typeId: 'shipping-method' },
            externalTaxRate: {
              amount: 0,
              country: 'CL',
              name: 'noTax'
            }
          }
        ]);
      });
    });
  });

  describe('buildSapPositionsActions', () => {
    let response: CartUpdateAction[];

    beforeEach(() => {
      response = service.buildSapPositionsActions([...mockCartResponse.lineItems, ...mockCartResponse.lineItems, ...mockCartResponse.lineItems]);
    });

    test('should return actions', () => {
      expect(response).toEqual([
        {
          action: 'setLineItemCustomField',
          lineItemId: '91d70604-1d60-4d64-8cc4-d2d5f54906cb',
          name: 'sapPositions',
          value:
            '{"quantity":1,"position":10,"priceConditions":[{"sapCode":"ZT02","amount":10,"currency":"CLP"},{"sapCode":"ZPRE","amount":1322,"currency":"CLP"},{"sapCode":"ZD13","amount":-134,"currency":"CLP","commercialAgreement":"AGREE123"}]}'
        },
        {
          action: 'setLineItemCustomField',
          lineItemId: '91d70604-1d60-4d64-8cc4-d2d5f54906cb',
          name: 'sapPositions',
          value:
            '{"quantity":1,"position":20,"priceConditions":[{"sapCode":"ZT02","amount":10,"currency":"CLP"},{"sapCode":"ZPRE","amount":1322,"currency":"CLP"},{"sapCode":"ZD13","amount":-134,"currency":"CLP","commercialAgreement":"AGREE123"}]}'
        },
        {
          action: 'setLineItemCustomField',
          lineItemId: '91d70604-1d60-4d64-8cc4-d2d5f54906cb',
          name: 'sapPositions',
          value:
            '{"quantity":1,"position":30,"priceConditions":[{"sapCode":"ZT02","amount":10,"currency":"CLP"},{"sapCode":"ZPRE","amount":1322,"currency":"CLP"},{"sapCode":"ZD13","amount":-134,"currency":"CLP","commercialAgreement":"AGREE123"}]}'
        }
      ]);
    });
  });

  describe('buildSetDeliveryDateActions', () => {
    let response: CartUpdateAction[];

    beforeEach(() => {
      response = service.buildSetDeliveryDateActions('2023-07-17T16:04:31.880Z');
    });

    test('should return actions', () => {
      expect(response).toEqual([
        {
          action: 'setCustomField',
          name: 'deliveryDate',
          value: '2023-07-17T16:04:31.880Z'
        }
      ]);
    });
  });

  describe('buildSetCreditBlockedReasonActions', () => {
    test('should return company blocked action', async () => {
      const response = await service.buildSetCreditBlockedReasonActions(mockCompanyBusinessUnitCreditBlocked);

      expect(response).toEqual([
        {
          action: 'setCustomField',
          name: 'creditBlockedReason',
          value: COMPANY_BLOCKED
        }
      ]);
    });

    test('should return division blocked action', async () => {
      const response = await service.buildSetCreditBlockedReasonActions(mockDivisionBusinessUnitCreditBlocked);

      expect(response).toEqual([
        {
          action: 'setCustomField',
          name: 'creditBlockedReason',
          value: DIVISION_BLOCKED
        }
      ]);
    });

    test('should not return an action', async () => {
      const response = await service.buildSetCreditBlockedReasonActions(mockDivisionBusinessUnit);

      expect(response).toEqual([]);
    });

    test('should return company blocked action by parent', async () => {
      mockDivisionBusinessUnit.parentUnit = {
        ...mockDivisionBusinessUnit.parentUnit,
        key: 'blocked'
      };

      const response = await service.buildSetCreditBlockedReasonActions(mockDivisionBusinessUnit);

      expect(response).toEqual([
        {
          action: 'setCustomField',
          name: 'creditBlockedReason',
          value: COMPANY_BLOCKED
        }
      ]);
    });
  });
});
