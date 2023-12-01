global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

const url = 'https://test.com/v1';

const mockConfigService = {
  get: (key: string) => {
    if (key === 'svc-carts.baseUrl') return url;

    return key;
  }
};

const mockDeliveryZoneService = {
  getT2Zone: jest.fn(key => {
    switch (key) {
      default:
        return Promise.resolve(mockDeliveryZonesResponse);
    }
  })
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

jest.mock('@/delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZoneService)
}));

jest.mock('@adelco/lib_delivery', () => ({
  getNextDeliveryDates: jest.fn().mockImplementation(() => mockGetNextDeliveryDates)
}));

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SvcCartsService } from '../svc-carts.service';
import { mockGetActiveCart, mockGetNextDeliveryDates } from '../__mocks__/svc-carts.mock';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { mockDeliveryZonesResponse } from '@/delivery-zones/__mocks__/delivery-zones.mock';
import { AdelcoCart } from '@adelco/price-calc';

describe('SvcCartsService', () => {
  let service: SvcCartsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SvcCartsService, ConfigService, DeliveryZonesService]
    }).compile();

    service = module.get<SvcCartsService>(SvcCartsService);
  });

  describe('getActiveCart', () => {
    let response: NotFoundException | AdelcoCart;

    describe('when succeeds', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => mockGetActiveCart
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        response = await service.getActiveCart('business-unit-id', 'username@username.com', ['Roles']);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(`${url}/business-unit/business-unit-id/carts/active?forceUpdate=false`, {
          headers: { 'Content-Type': 'application/json', 'x-user-id': 'username@username.com', 'x-user-roles': '["Roles"]' },
          method: 'GET'
        });
      });

      it('should get an active cart', () => {
        expect(response).toEqual(mockGetActiveCart);
      });
    });

    describe('when failure', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 404,
              message: 'Not active cart for this user.'
            })
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        try {
          await service.getActiveCart('business-unit-id', 'not-active-cart@username.com', ['Roles']);
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(`${url}/business-unit/business-unit-id/carts/active?forceUpdate=false`, {
          headers: { 'Content-Type': 'application/json', 'x-user-id': 'not-active-cart@username.com', 'x-user-roles': '["Roles"]' },
          method: 'GET'
        });
      });

      it('should return error NotFoundException', () => {
        expect(response).toEqual(new NotFoundException('Not active cart for this user.'));
      });
    });
  });

  describe('checkDeliveryDateForCart', () => {
    let newDate: string;
    describe('when success', () => {
      it('should call updateDeliveryDate', async () => {
        newDate = await service.checkAndGetDeliveryDateForCart('123', '2023-08-28T15:29:00Z', true);
        expect(newDate).toEqual('2023-08-29T15:30:00Z');
      });

      it('should call updateDeliveryDate with the minimum', async () => {
        newDate = await service.checkAndGetDeliveryDateForCart('123', '2023-08-28T15:29:00Z');
        expect(newDate).toEqual('2023-08-29T15:30:00Z');
      });

      it('should not call updateDeliveryDate', async () => {
        newDate = await service.checkAndGetDeliveryDateForCart('123', '2023-08-29T15:30:00Z');
        expect(newDate).toEqual('2023-08-29T15:30:00Z');
      });
    });
  });
});
