const mockPaymentMethods = {
  paymentMethods: [
    {
      key: 'BankTransfer',
      description: 'Transferencia',
      termDays: 0,
      dependsOnCreditLineStatus: false
    },
    {
      key: 'Cash',
      description: 'Efectivo',
      termDays: 0,
      dependsOnCreditLineStatus: false
    },
    {
      key: 'DayCheck',
      description: 'Cheque al día',
      termDays: 30,
      dependsOnCreditLineStatus: true
    },
    {
      key: 'DateCheck',
      description: 'Cheque a fecha a 30 días',
      termDays: 30,
      dependsOnCreditLineStatus: true
    },
    {
      key: 'Credit',
      description: 'crédito simple a 30 días',
      termDays: 30,
      dependsOnCreditLineStatus: true
    }
  ]
};

const mockBusinessUnitCartsService = {
  getActiveCart: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  getActiveCartByBuId: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  deleteLineItem: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  updateLineItemQuantity: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  addLineItems: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  deleteCart: jest.fn().mockImplementation((userId, buId) => {
    if (buId === 'notfound') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorNotFound));
    } else {
      return Promise.resolve();
    }
  }),
  deleteDiscountCode: jest.fn().mockImplementation((userId, buId) => {
    if (buId === 'notfound') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorNotFound));
    } else {
      return Promise.resolve();
    }
  }),
  addDiscountCode: jest.fn(),
  updateSyncCart: jest.fn().mockImplementation(() => {
    return mockAdelcoCartResponse;
  }),
  getEnabledPaymentMethods: jest.fn().mockImplementation(() => {
    return mockPaymentMethods;
  }),
  checkStockAndPriceChanges: jest.fn().mockImplementation((cart, businessUnitId, forceUpdate = false) => {
    if (forceUpdate) {
      return Promise.resolve({ cartUpdates: { isQuantityUpdated: true, isPriceUpdated: true }, cart: mockCommercetoolsCartResponse });
    }
    return Promise.resolve({ cart: mockCommercetoolsCartResponse });
  })
};

jest.mock('@adelco/price-calc', () => ({
  convertToAdelcoFormat: jest.fn().mockImplementation(() => mockAdelcoCartResponse)
}));

jest.mock('../business-unit-carts.service', () => ({
  BusinessUnitCartsService: jest.fn().mockImplementation(() => mockBusinessUnitCartsService)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'businessUnitsCarts.userHeaderId':
        return userHeaderId;
      case 'businessUnitsCarts.userHeaderRoles':
        return userHeaderRoles;
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { mockAdelcoCartResponse, mockAdelcoCartWithCartUpdatesResponse, mockCommercetoolsCartResponse } from '@/carts/__mock__/carts.mock';
import { BusinessUnitCartsController } from '../business-unit-carts.controller';
import { BusinessUnitCartsService } from '../business-unit-carts.service';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { AdelcoCart } from '@adelco/price-calc';
import { CommercetoolsError } from '@/nest-commercetools';
import { mockCommercetoolsErrorNotFound } from '../../carts/__mock__/carts.mock';

describe('BusinessUnitsController', () => {
  let controller: BusinessUnitCartsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitCartsController],
      providers: [BusinessUnitCartsService, ConfigService]
    }).compile();

    controller = module.get<BusinessUnitCartsController>(BusinessUnitCartsController);
  });

  describe('getActiveCart', () => {
    let response: AdelcoCart | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.getActiveCart({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id');
      });

      it('should call BusinessUnitCartsService.getActiveCart', () => {
        expect(mockBusinessUnitCartsService.getActiveCartByBuId).toHaveBeenCalledWith('business-unit-id', 'johndoe@mail.com', ['CSR']);
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.getActiveCart({ 'x-user-roles': '["CSR"]' }, 'business-unit-id');
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitCartsService.getActiveCart', () => {
        expect(mockBusinessUnitCartsService.getActiveCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        response = await controller.getActiveCart({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', { forceUpdate: true });
      });

      it('should call BusinessUnitCartsService.getActiveCart', () => {
        expect(mockBusinessUnitCartsService.getActiveCartByBuId).toHaveBeenCalledWith('business-unit-id', 'johndoe@mail.com', ['CSR']);
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartWithCartUpdatesResponse);
      });
    });
  });

  describe('deleteLineItem', () => {
    let response: AdelcoCart | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.deleteLineItem({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', 'line-item-id');
      });

      it('should call BusinessUnitCartsService.deleteLineItem', () => {
        expect(mockBusinessUnitCartsService.deleteLineItem).toHaveBeenCalledWith('business-unit-id', 'line-item-id', 'johndoe@mail.com', ['CSR']);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.deleteLineItem({ 'x-user-roles': '["CSR"]' }, 'business-unit-id', 'line-item-id');
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitCartsService.deleteLineItem', () => {
        expect(mockBusinessUnitCartsService.deleteLineItem).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        response = await controller.deleteLineItem({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', 'line-item-id', { forceUpdate: true });
      });

      it('should call BusinessUnitCartsService.deleteLineItem', () => {
        expect(mockBusinessUnitCartsService.deleteLineItem).toHaveBeenCalledWith('business-unit-id', 'line-item-id', 'johndoe@mail.com', ['CSR']);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartWithCartUpdatesResponse);
      });
    });
  });

  describe('updateLineItemQuantity', () => {
    let response: AdelcoCart | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.updateLineItemQuantity({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', 'line-item-id', { quantity: 5 });
      });

      it('should call BusinessUnitCartsService.updateLineItemQuantity', () => {
        expect(mockBusinessUnitCartsService.updateLineItemQuantity).toHaveBeenCalledWith('business-unit-id', 'line-item-id', { quantity: 5 }, 'johndoe@mail.com', ['CSR']);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.updateLineItemQuantity({ 'x-user-roles': '["CSR"]' }, 'business-unit-id', 'line-item-id', { quantity: 5 });
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitCartsService.updateLineItemQuantity', () => {
        expect(mockBusinessUnitCartsService.updateLineItemQuantity).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        response = await controller.updateLineItemQuantity(
          { 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' },
          'business-unit-id',
          'line-item-id',
          { quantity: 5 },
          { forceUpdate: true }
        );
      });

      it('should call BusinessUnitCartsService.updateLineItemQuantity', () => {
        expect(mockBusinessUnitCartsService.updateLineItemQuantity).toHaveBeenCalledWith('business-unit-id', 'line-item-id', { quantity: 5 }, 'johndoe@mail.com', ['CSR']);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartWithCartUpdatesResponse);
      });
    });
  });

  describe('addLineItems', () => {
    let response: AdelcoCart | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.addLineItems({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', { sku: 'sku1', quantity: 1 });
      });

      it('should call BusinessUnitCartsService.addLineItems', () => {
        expect(mockBusinessUnitCartsService.addLineItems).toHaveBeenCalledWith('johndoe@mail.com', { sku: 'sku1', quantity: 1 }, 'business-unit-id', ['CSR']);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when no roles provided', () => {
      beforeEach(async () => {
        response = await controller.addLineItems({ 'x-user-id': 'johndoe@mail.com' }, 'business-unit-id', { sku: 'sku1', quantity: 1 });
      });

      it('should call BusinessUnitCartsService.addLineItems', () => {
        expect(mockBusinessUnitCartsService.addLineItems).toHaveBeenCalledWith('johndoe@mail.com', { sku: 'sku1', quantity: 1 }, 'business-unit-id', []);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          response = await controller.addLineItems({ 'x-user-roles': '["CSR"]' }, 'business-unit-id', { sku: 'sku1', quantity: 1 });
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitCartsService.addLineItems', () => {
        expect(mockBusinessUnitCartsService.addLineItems).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        response = await controller.addLineItems(
          { 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' },
          'business-unit-id',
          { sku: 'sku1', quantity: 1 },
          { forceUpdate: true }
        );
      });

      it('should call BusinessUnitCartsService.addLineItems', () => {
        expect(mockBusinessUnitCartsService.addLineItems).toHaveBeenCalledWith('johndoe@mail.com', { sku: 'sku1', quantity: 1 }, 'business-unit-id', ['CSR']);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartWithCartUpdatesResponse);
      });
    });
  });

  describe('deleteCart', () => {
    let response: BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        await controller.deleteCart({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id');
      });

      it('should call BusinessUnitCartsService.deleteCart', () => {
        expect(mockBusinessUnitCartsService.deleteCart).toHaveBeenCalledWith('johndoe@mail.com', 'business-unit-id', ['CSR']);
      });
    });

    describe('when no roles provided', () => {
      beforeEach(async () => {
        await controller.deleteCart({ 'x-user-id': 'johndoe@mail.com' }, 'business-unit-id');
      });

      it('should call BusinessUnitCartsService.deleteCart', () => {
        expect(mockBusinessUnitCartsService.deleteCart).toHaveBeenCalledWith('johndoe@mail.com', 'business-unit-id', []);
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.deleteCart({ 'x-user-roles': '["CSR"]' }, 'business-unit-id');
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitCartsService.deleteCart', () => {
        expect(mockBusinessUnitCartsService.deleteCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when a bu is not found', () => {
      beforeEach(async () => {
        try {
          await controller.deleteCart({ 'x-user-id': 'johndoe@mail.com' }, 'notfound');
        } catch (e) {
          response = e as NotFoundException;
        }
      });

      it('should throw an Error', () => {
        expect(response.message).toEqual('Not Found');
      });
    });
  });

  describe('updateSyncCart', () => {
    let response: AdelcoCart | BadRequestException | ForbiddenException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.updateSyncCart({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["__INTERNAL__"]' }, 'business-unit-id', {
          lineItems: [{ sku: 'sku', quantity: 1 }]
        });
      });

      it('should call BusinessUnitCartsService.updateSyncCart', () => {
        expect(mockBusinessUnitCartsService.updateSyncCart).toHaveBeenCalledWith('johndoe@mail.com', 'business-unit-id', { lineItems: [{ quantity: 1, sku: 'sku' }] }, undefined);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-user-roles"] is not valid', () => {
      beforeEach(async () => {
        try {
          response = await controller.updateSyncCart({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["NO_VALID"]' }, 'business-unit-id', {
            lineItems: [{ sku: 'sku', quantity: 1 }]
          });
        } catch (error) {
          response = error;
        }
      });

      it('should not call BusinessUnitCartsService.updateSyncCart', () => {
        expect(mockBusinessUnitCartsService.updateSyncCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new ForbiddenException('Insufficient permissions'));
      });
    });

    describe('when a header["x-user-roles"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.updateSyncCart({ 'x-user-id': 'johndoe@mail.com' }, 'business-unit-id', { lineItems: [{ sku: 'sku', quantity: 1 }] });
        } catch (error) {
          response = error;
        }
      });

      it('should not call BusinessUnitCartsService.updateSyncCart', () => {
        expect(mockBusinessUnitCartsService.updateSyncCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User roles missing'));
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          response = await controller.updateSyncCart({ 'x-user-roles': '["__INTERNAL__"]' }, 'business-unit-id', { lineItems: [{ sku: 'sku', quantity: 1 }] });
        } catch (error) {
          response = error;
        }
      });

      it('should not call BusinessUnitCartsService.updateSyncCart', () => {
        expect(mockBusinessUnitCartsService.updateSyncCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when force update param is provided', () => {
      const forceUpdate = true;
      beforeEach(async () => {
        response = await controller.updateSyncCart(
          { 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["__INTERNAL__"]' },
          'business-unit-id',
          {
            lineItems: [{ sku: 'sku', quantity: 1 }]
          },
          { forceUpdate }
        );
      });

      it('should call BusinessUnitCartsService.updateSyncCart', () => {
        expect(mockBusinessUnitCartsService.updateSyncCart).toHaveBeenCalledWith('johndoe@mail.com', 'business-unit-id', { lineItems: [{ quantity: 1, sku: 'sku' }] }, forceUpdate);
      });

      it('should return expected response a cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });
  });

  describe('deleteDiscountCode', () => {
    let response: BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        await controller.deleteDiscountCode({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', 'discount-code');
      });

      it('should call BusinessUnitCartsService.deleteDiscountCode', () => {
        expect(mockBusinessUnitCartsService.deleteDiscountCode).toHaveBeenCalledWith('business-unit-id', 'discount-code', 'johndoe@mail.com', ['CSR']);
      });
    });

    describe('when no roles provided', () => {
      beforeEach(async () => {
        await controller.deleteDiscountCode({ 'x-user-id': 'johndoe@mail.com' }, 'business-unit-id', 'discount-code');
      });

      it('should call BusinessUnitCartsService.deleteDiscountCode', () => {
        expect(mockBusinessUnitCartsService.deleteDiscountCode).toHaveBeenCalledWith('business-unit-id', 'discount-code', 'johndoe@mail.com', []);
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.deleteDiscountCode({ 'x-user-roles': '["CSR"]' }, 'business-unit-id', 'discount-code');
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitCartsService.deleteDiscountCode', () => {
        expect(mockBusinessUnitCartsService.deleteDiscountCode).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        await controller.deleteDiscountCode({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', 'discount-code', { forceUpdate: true });
      });

      it('should call BusinessUnitCartsService.deleteDiscountCode', () => {
        expect(mockBusinessUnitCartsService.deleteDiscountCode).toHaveBeenCalledWith('business-unit-id', 'discount-code', 'johndoe@mail.com', ['CSR']);
      });
    });
  });

  describe('addDiscountCode', () => {
    let response: BadRequestException;
    const body = {
      code: 'discount-code'
    };

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        await controller.addDiscountCode({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', body);
      });

      it('should call BusinessUnitCartsService.addDiscountCode', () => {
        expect(mockBusinessUnitCartsService.addDiscountCode).toHaveBeenCalledWith('business-unit-id', 'discount-code', 'johndoe@mail.com', ['CSR']);
      });
    });

    describe('when no roles provided', () => {
      beforeEach(async () => {
        await controller.addDiscountCode({ 'x-user-id': 'johndoe@mail.com' }, 'business-unit-id', body);
      });

      it('should call BusinessUnitCartsService.addDiscountCode', () => {
        expect(mockBusinessUnitCartsService.addDiscountCode).toHaveBeenCalledWith('business-unit-id', 'discount-code', 'johndoe@mail.com', []);
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.addDiscountCode({ 'x-user-roles': '["CSR"]' }, 'business-unit-id', body);
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitCartsService.addDiscountCode', () => {
        expect(mockBusinessUnitCartsService.addDiscountCode).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        await controller.addDiscountCode({ 'x-user-id': 'johndoe@mail.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', body, { forceUpdate: true });
      });

      it('should call BusinessUnitCartsService.addDiscountCode', () => {
        expect(mockBusinessUnitCartsService.addDiscountCode).toHaveBeenCalledWith('business-unit-id', 'discount-code', 'johndoe@mail.com', ['CSR']);
      });
    });
  });

  describe('getEnabledPaymentMethods', () => {
    describe('when correct header is provided', () => {
      beforeEach(async () => {
        await controller.getEnabledPaymentMethods({ 'x-user-id': 'johndoe@mail.com' }, '1');
      });
      it('should call getEnabledPaymentMethods with the correct params', () => {
        expect(mockBusinessUnitCartsService.getEnabledPaymentMethods).toHaveBeenCalledWith('1', 'johndoe@mail.com');
      });
    });

    describe('when required header is not provided', () => {
      let response: BadRequestException;
      beforeEach(async () => {
        try {
          await controller.getEnabledPaymentMethods({}, '1');
        } catch (e) {
          response = e as BadRequestException;
        }
      });
      it('should not call getEnabledPaymentMethods', () => {
        expect(mockBusinessUnitCartsService.getEnabledPaymentMethods).not.toHaveBeenCalled();
      });
      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });
  });
});
