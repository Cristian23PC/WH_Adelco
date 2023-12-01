import { RegionsService } from '@/regions/regions.service';

const mockRegionsService = {
  getRegions: jest.fn().mockImplementation(() => {
    return mockRegionsResponse;
  })
};

const mockDeliveryZonesService = {
  getDeliveryZones: jest.fn().mockImplementation((communeKey: string) => {
    if (communeKey === 'error-delivery-zones') {
      throw new Error('Commercetools error');
    }
    return mockDeliveryZonesResponse;
  })
};

const mockCommunesService = {
  getCommune: jest.fn().mockImplementation((communeKey: string) => {
    if (communeKey === 'no-comune') {
      return undefined;
    } else if (communeKey === 'different-comune') {
      return mockCommunesResponse[1];
    }
    return mockCommunesResponse[0];
  }),
  getCommunes: jest.fn().mockImplementation((regionKey: string) => {
    if (regionKey === 'error') {
      throw new Error('Commercetools error');
    }
    return mockCommunesResponse;
  })
};

jest.mock('../../regions/regions.service', () => ({
  RegionsService: jest.fn().mockImplementation(() => mockRegionsService)
}));

jest.mock('../../delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZonesService)
}));

jest.mock('../../communes/communes.service', () => ({
  CommunesService: jest.fn().mockImplementation(() => mockCommunesService)
}));

import { BusinessUnitsRegionsController } from '../business-units-regions.controller';
import { CacheModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CommunesService } from '@/communes/communes.service';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { mockRegionsResponse } from '@/regions/__mocks__/regions.mock';
import { mockDeliveryZonesResponse } from '@/delivery-zones/__mocks__/delivery-zones.mock';
import { mockCommunesResponse } from '@/communes/__mocks__/communes.mock';
import { Region } from '@/regions/models';
import { Commune } from '@/communes/models';
import { DeliveryZone } from '@/delivery-zones/models';

describe('BusinessUnitsRegionsController', () => {
  let controller: BusinessUnitsRegionsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [BusinessUnitsRegionsController],
      providers: [RegionsService, CommunesService, DeliveryZonesService]
    }).compile();

    controller = module.get<BusinessUnitsRegionsController>(BusinessUnitsRegionsController);
  });

  describe('getRegions', () => {
    let response: Region[];

    describe('when requesting regions', () => {
      beforeEach(async () => {
        response = await controller.getRegions();
      });

      it('should call RegionsService.getRegions', () => {
        expect(mockRegionsService.getRegions).toHaveBeenCalled();
      });

      it('should return expected response with regions', () => {
        expect(response).toEqual(mockRegionsResponse);
      });
    });
  });

  describe('getCommunes', () => {
    let response: Commune[] | Error;
    let regionKey: string;

    describe('when requesting communes', () => {
      beforeEach(async () => {
        regionKey = 'de-antofagasta';
        response = await controller.getCommunes(regionKey);
      });

      it('should call CommunesService.getCommunes', () => {
        expect(mockCommunesService.getCommunes).toHaveBeenCalledWith(regionKey);
      });

      it('should return expected response with communes', () => {
        expect(response).toEqual(mockCommunesResponse);
      });
    });

    describe('when requesting communes and commercetools fail', () => {
      beforeEach(async () => {
        regionKey = 'error';
        try {
          await controller.getCommunes(regionKey);
        } catch (error) {
          response = error as Error;
        }
      });

      it('should call CommunesService.getCommunes', () => {
        expect(mockCommunesService.getCommunes).toHaveBeenCalledWith(regionKey);
      });

      it('should throw CommunesService.getCommunes error', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });

  describe('getDeliveryZones', () => {
    let response: DeliveryZone[] | Error;
    let regionKey: string;
    let communeKey: string;

    describe('when requesting delivery zones', () => {
      beforeEach(async () => {
        regionKey = 'de-antofagasta';
        communeKey = 'commune-key';
        response = await controller.getDeliveryZones(regionKey, communeKey);
      });

      it('should call CommunesService.getCommune', () => {
        expect(mockCommunesService.getCommune).toHaveBeenCalledWith(communeKey);
      });

      it('should call DeliveryZonesService.getDeliveryZones', () => {
        expect(mockDeliveryZonesService.getDeliveryZones).toHaveBeenCalledWith(communeKey);
      });

      it('should return expected response with delivery zones', () => {
        expect(response).toEqual(mockDeliveryZonesResponse);
      });
    });

    describe('when requesting delivery zones & not find a commune', () => {
      beforeEach(async () => {
        regionKey = 'de-antofagasta';
        communeKey = 'no-comune';
        response = await controller.getDeliveryZones(regionKey, communeKey);
      });

      it('should call CommunesService.getCommune', () => {
        expect(mockCommunesService.getCommune).toHaveBeenCalledWith(communeKey);
      });

      it('should not call DeliveryZonesService.getDeliveryZones', () => {
        expect(mockDeliveryZonesService.getDeliveryZones).not.toHaveBeenCalled();
      });

      it('should return empty array', () => {
        expect(response).toEqual([]);
      });
    });

    describe('when requesting delivery zones & commune return different comune', () => {
      beforeEach(async () => {
        regionKey = 'de-different';
        communeKey = 'different-comune';
        response = await controller.getDeliveryZones(regionKey, communeKey);
      });

      it('should call CommunesService.getCommune', () => {
        expect(mockCommunesService.getCommune).toHaveBeenCalledWith(communeKey);
      });

      it('should not call DeliveryZonesService.getDeliveryZones', () => {
        expect(mockDeliveryZonesService.getDeliveryZones).not.toHaveBeenCalled();
      });

      it('should return empty array', () => {
        expect(response).toEqual([]);
      });
    });

    describe('when requesting delivery zones and commercetools fail', () => {
      beforeEach(async () => {
        regionKey = 'de-antofagasta';
        communeKey = 'error-delivery-zones';
        try {
          await controller.getDeliveryZones(regionKey, communeKey);
        } catch (error) {
          response = error as Error;
        }
      });

      it('should call CommunesService.getCommune', () => {
        expect(mockCommunesService.getCommune).toHaveBeenCalledWith(communeKey);
      });

      it('should call DeliveryZonesService.getDeliveryZones', () => {
        expect(mockDeliveryZonesService.getDeliveryZones).toHaveBeenCalledWith(communeKey);
      });

      it('should throw DeliveryZonesService.getDeliveryZones error', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });
});
