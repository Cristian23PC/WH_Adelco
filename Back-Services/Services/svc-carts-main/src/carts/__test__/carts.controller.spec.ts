const mockCartsService = {
  orderContactRequest: jest.fn(),
  getAnonymousCart: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  removeAnonymousLineItem: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  updateAnonymousLineItemQuantity: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  deleteAnonymousCart: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  addAnonymousLineItems: jest.fn().mockImplementation(() => {
    return mockCommercetoolsCartResponse;
  }),
  checkStockAndPriceChanges: jest.fn().mockImplementation((cart, forceUpdate = false) => {
    if (forceUpdate) {
      return Promise.resolve({ cartUpdates: { isQuantityUpdated: true, isPriceUpdated: true }, cart: mockCommercetoolsCartResponse });
    }
    return Promise.resolve({ cart: mockCommercetoolsCartResponse });
  })
};

jest.mock('@adelco/price-calc', () => ({
  convertToAdelcoFormat: jest.fn().mockImplementation(() => mockAdelcoCartResponse)
}));

jest.mock('../carts.service', () => ({
  CartsService: jest.fn().mockImplementation(() => mockCartsService)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'cart.anonymousHeaderId':
        return anonymousHeaderId;
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
import { BadRequestException } from '@nestjs/common';
import { mockAdelcoCartResponse, mockAdelcoCartWithCartUpdatesResponse, mockCommercetoolsCartResponse } from '@/carts/__mock__/carts.mock';
import { anonymousHeaderId } from '@/common/constants/headers';
import { CartsController } from '../carts.controller';
import { CartsService } from '../carts.service';
import { AdelcoCart } from '@adelco/price-calc';
import { OrderContactRequestDto } from '../dto/orderContactRequest';

describe('CartsController', () => {
  let controller: CartsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [CartsService, ConfigService]
    }).compile();

    controller = module.get<CartsController>(CartsController);
  });

  describe('getAnonymousCart', () => {
    let response: AdelcoCart | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.getAnonymousCart({ 'x-anonymous-id': 'anonymous-id' }, { deliveryZone: 'delivery-zone-id' });
      });

      it('should call CartsService.getAnonymousCart', () => {
        expect(mockCartsService.getAnonymousCart).toHaveBeenCalledWith('delivery-zone-id', 'anonymous-id');
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-anonymous-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.getAnonymousCart({}, { deliveryZone: 'delivery-zone-id' });
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call CartsService.getAnonymousCart', () => {
        expect(mockCartsService.getAnonymousCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('Anonymous ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        response = await controller.getAnonymousCart({ 'x-anonymous-id': 'anonymous-id' }, { deliveryZone: 'delivery-zone-id', forceUpdate: true });
      });

      it('should call CartsService.getAnonymousCart', () => {
        expect(mockCartsService.getAnonymousCart).toHaveBeenCalledWith('delivery-zone-id', 'anonymous-id');
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartWithCartUpdatesResponse);
      });
    });
  });

  describe('removeAnonymousLineItem', () => {
    let response: AdelcoCart | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.removeAnonymousLineItem({ 'x-anonymous-id': 'anonymous-id' }, 'line-item-id');
      });

      it('should call CartsService.removeAnonymousLineItem', () => {
        expect(mockCartsService.removeAnonymousLineItem).toHaveBeenCalledWith('line-item-id', 'anonymous-id');
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-anonymous-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.removeAnonymousLineItem({}, 'line-item-id');
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call CartsService.removeAnonymousLineItem', () => {
        expect(mockCartsService.removeAnonymousLineItem).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('Anonymous ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        response = await controller.removeAnonymousLineItem({ 'x-anonymous-id': 'anonymous-id' }, 'line-item-id', { forceUpdate: true });
      });

      it('should call CartsService.removeAnonymousLineItem', () => {
        expect(mockCartsService.removeAnonymousLineItem).toHaveBeenCalledWith('line-item-id', 'anonymous-id');
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartWithCartUpdatesResponse);
      });
    });
  });

  describe('updateAnonymousLineItemQuantity', () => {
    let response: AdelcoCart | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.updateAnonymousLineItemQuantity({ 'x-anonymous-id': 'anonymous-id' }, 'line-item-id', { quantity: 1 });
      });

      it('should call CartsService.updateAnonymousLineItemQuantity', () => {
        expect(mockCartsService.updateAnonymousLineItemQuantity).toHaveBeenCalledWith('line-item-id', 1, 'anonymous-id');
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-anonymous-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.updateAnonymousLineItemQuantity({}, 'line-item-id', { quantity: 1 });
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call CartsService.updateAnonymousLineItemQuantity', () => {
        expect(mockCartsService.updateAnonymousLineItemQuantity).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('Anonymous ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        response = await controller.updateAnonymousLineItemQuantity({ 'x-anonymous-id': 'anonymous-id' }, 'line-item-id', { quantity: 1 }, { forceUpdate: true });
      });

      it('should call CartsService.updateAnonymousLineItemQuantity', () => {
        expect(mockCartsService.updateAnonymousLineItemQuantity).toHaveBeenCalledWith('line-item-id', 1, 'anonymous-id');
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartWithCartUpdatesResponse);
      });
    });
  });

  describe('addAnonymousLineItems', () => {
    let response: AdelcoCart | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.addAnonymousLineItems({ 'x-anonymous-id': 'anonymous-id' }, { sku: 'sku1', quantity: 1 }, { deliveryZone: 'delivery-zone-id' });
      });

      it('should call CartsService.addAnonymousLineItems', () => {
        expect(mockCartsService.addAnonymousLineItems).toHaveBeenCalledWith({ quantity: 1, sku: 'sku1' }, 'delivery-zone-id', 'anonymous-id');
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartResponse);
      });
    });

    describe('when a header["x-anonymous-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.addAnonymousLineItems({}, { sku: 'sku1', quantity: 1 }, { deliveryZone: 'delivery-zone-id' });
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call CartsService.addAnonymousLineItems', () => {
        expect(mockCartsService.addAnonymousLineItems).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('Anonymous ID missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      beforeEach(async () => {
        response = await controller.addAnonymousLineItems(
          { 'x-anonymous-id': 'anonymous-id' },
          { sku: 'sku1', quantity: 1 },
          { deliveryZone: 'delivery-zone-id', forceUpdate: true }
        );
      });

      it('should call CartsService.addAnonymousLineItems', () => {
        expect(mockCartsService.addAnonymousLineItems).toHaveBeenCalledWith({ quantity: 1, sku: 'sku1' }, 'delivery-zone-id', 'anonymous-id');
      });

      it('should return expected response with active cart', () => {
        expect(response).toEqual(mockAdelcoCartWithCartUpdatesResponse);
      });
    });
  });

  describe('deleteAnonymousCart', () => {
    let response: void | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.deleteAnonymousCart({ 'x-anonymous-id': 'anonymous-id' });
      });

      it('should call CartsService.deleteAnonymousCart', () => {
        expect(mockCartsService.deleteAnonymousCart).toHaveBeenCalledWith('anonymous-id');
      });
    });

    describe('when a header["x-anonymous-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.deleteAnonymousCart({});
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call CartsService.deleteAnonymousCart', () => {
        expect(mockCartsService.deleteAnonymousCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('Anonymous ID missing'));
      });
    });
  });

  describe('orderContactRequest', () => {
    let response: void | BadRequestException;
    const bodyMock: OrderContactRequestDto = {} as OrderContactRequestDto;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.orderContactRequest({ 'x-anonymous-id': 'anonymous-id' }, bodyMock);
      });

      it('should call CartsService.orderContactRequest', () => {
        expect(mockCartsService.orderContactRequest).toHaveBeenCalledWith('anonymous-id', bodyMock);
      });
    });

    describe('when a header["x-anonymous-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.orderContactRequest({}, bodyMock);
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call CartsService.orderContactRequest', () => {
        expect(mockCartsService.orderContactRequest).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('Anonymous ID missing'));
      });
    });
  });
});
