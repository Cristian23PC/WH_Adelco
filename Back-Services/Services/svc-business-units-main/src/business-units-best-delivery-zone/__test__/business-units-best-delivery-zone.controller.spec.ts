const mockDeliveryZonesService = {
  getDeliveryZonesByLocality: jest.fn().mockImplementation((locality: string) => {
    if (locality === 'error-delivery-zones') {
      throw new Error('Commercetools error');
    }
    if (locality === 'not-matching') {
      return [];
    }
    return mockDeliveryZonesResponse;
  })
};

jest.mock('../../delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZonesService)
}));

import { BusinessUnitsBestDeliveryZoneController } from '../business-units-best-delivery-zone.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { mockDeliveryZonesResponse } from '@/delivery-zones/__mocks__/delivery-zones.mock';
import { DeliveryZone } from '@/delivery-zones/models';
import { CacheModule } from '@nestjs/common';

describe('BusinessUnitsRegionsController', () => {
  let controller: BusinessUnitsBestDeliveryZoneController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [BusinessUnitsBestDeliveryZoneController],
      providers: [DeliveryZonesService]
    }).compile();

    controller = module.get<BusinessUnitsBestDeliveryZoneController>(BusinessUnitsBestDeliveryZoneController);
  });

  describe('getDeliveryZonesByLocality', () => {
    let response: DeliveryZone[] | Error;
    let locality: string;

    describe('when requesting delivery zones', () => {
      beforeEach(async () => {
        locality = 'commune-key';
        response = await controller.getDeliveryZonesByLocality({ locality });
      });

      it('should call DeliveryZonesService.getDeliveryZonesByLocality', () => {
        expect(mockDeliveryZonesService.getDeliveryZonesByLocality).toHaveBeenCalledWith(locality);
      });

      it('should return expected response with delivery zones', () => {
        expect(response).toEqual(mockDeliveryZonesResponse);
      });
    });

    describe('when requesting delivery zones that does not match', () => {
      beforeEach(async () => {
        locality = 'not-matching';
        response = await controller.getDeliveryZonesByLocality({ locality });
      });

      it('should not call DeliveryZonesService.getDeliveryZonesByLocality', () => {
        expect(mockDeliveryZonesService.getDeliveryZonesByLocality).toHaveBeenCalledWith(locality);
      });

      it('should return empty array', () => {
        expect(response).toEqual([]);
      });
    });

    describe('when requesting delivery zones and commercetools fail', () => {
      beforeEach(async () => {
        locality = 'error-delivery-zones';
        try {
          await controller.getDeliveryZonesByLocality({ locality });
        } catch (error) {
          response = error as Error;
        }
      });

      it('should call DeliveryZonesService.getDeliveryZonesByLocality', () => {
        expect(mockDeliveryZonesService.getDeliveryZonesByLocality).toHaveBeenCalledWith(locality);
      });

      it('should throw DeliveryZonesService.getDeliveryZonesByLocality error', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });
});
