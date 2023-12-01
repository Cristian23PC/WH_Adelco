const mockCustomObjectsRepository = {
  find: jest.fn((methodArgs: { queryArgs: { where: string[] } }) => {
    if (methodArgs.queryArgs.where[0].indexOf('antofagasta') >= 0) {
      return Promise.resolve({
        results: [
          {
            id: 'id',
            container: 'delivery-zone',
            key: 'antofagasta',
            value: {
              label: 'Antofagasta',
              t2Rate: '0.07',
              commune: 'antofagasta',
              dcCode: 'AM',
              dcLabel: 'Antofagasta'
            }
          }
        ]
      });
    }
    return Promise.resolve({
      results: [
        {
          id: 'id',
          container: 'delivery-zone',
          key: 'dz-key',
          value: {
            label: 'Viña del Mar',
            t2Rate: '0.08',
            commune: 'vina-del-mar',
            dcCode: 'LB',
            dcLabel: 'Lo Boza'
          }
        }
      ]
    });
  })
};

const mockChannelsRepository = {
  find: jest.fn((methodArgs: { queryArgs: { where: string[]; limit: number } }) => {
    if (methodArgs.queryArgs.where[1].indexOf('AM') >= 0) {
      return Promise.resolve({
        results: [mockAntofagasta]
      });
    } else {
      return Promise.resolve({
        results: []
      });
    }
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CustomObjectsRepository: jest.fn().mockImplementation(() => mockCustomObjectsRepository),
  ChannelsRepository: jest.fn().mockImplementation(() => mockChannelsRepository)
}));

const mockConfigService = {
  get: (key: string) => {
    if (key === 'common.minimumOrderCentAmount') return 5000;
    return key;
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomObjectsRepository, ChannelsRepository } from 'commercetools-sdk-repositories';
import { DeliveryZonesService } from '../delivery-zones.service';
import { DeliveryZone } from '../models';
import { NotFoundException } from '@nestjs/common';
import { mockAntofagasta } from '@/business-units/__mocks__/channels.mock';
import { BusinessUnitsHelper } from '@/common/helpers/business-units/business-units.helper';

describe('DeliveryZonesService', () => {
  let service: DeliveryZonesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryZonesService, CustomObjectsRepository, ChannelsRepository, ConfigService, BusinessUnitsHelper]
    }).compile();

    service = module.get<DeliveryZonesService>(DeliveryZonesService);
  });

  describe('getDeliveryZones', () => {
    let response: Error | DeliveryZone[];

    describe('when success for a delivery zone and distribution center without "Tradicional" distribution channel', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = [
          {
            key: 'dz-key',
            label: 'Viña del Mar',
            commune: 'vina-del-mar',
            dcCode: 'LB',
            dchDefault: undefined,
            dcLabel: 'Lo Boza',
            id: 'id',
            minimumOrderAmount: {
              currencyCode: 'CLP',
              type: 'string',
              fractionDigits: 0,
              centAmount: 5000
            }
          }
        ];
        response = await service.getDeliveryZones('commune');
      });

      it('should call customObjectRepository.find', () => {
        expect(mockCustomObjectsRepository.find).toHaveBeenCalledWith({
          queryArgs: {
            limit: 500,
            where: ['container = "custom-object-delivery-zone.deliveryZoneContainer" and value(commune="commune")']
          }
        });
      });

      it('should return customObjectRepository.getByContainerAndKey response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('getDeliveryZonesByLocality', () => {
    let response: Error | DeliveryZone[];

    describe('when success', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = [
          {
            key: 'dz-key',
            label: 'Viña del Mar',
            commune: 'vina-del-mar',
            dcCode: 'LB',
            dcLabel: 'Lo Boza',
            id: 'id',
            minimumOrderAmount: {
              currencyCode: 'CLP',
              type: 'string',
              fractionDigits: 0,
              centAmount: 5000
            }
          }
        ];
        response = await service.getDeliveryZonesByLocality('Dz Key');
      });

      it('should call customObjectRepository.find', () => {
        expect(mockCustomObjectsRepository.find).toHaveBeenCalledWith({
          queryArgs: {
            limit: 500,
            where: ['container = "custom-object-delivery-zone.deliveryZoneContainer" and key="dz-key"']
          }
        });
      });

      it('should return customObjectRepository.getByContainerAndKey response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });

    describe('when not found', () => {
      beforeEach(async () => {
        mockCustomObjectsRepository.find.mockReturnValueOnce(Promise.resolve({ results: [] }));
      });

      it('should throw not found error', async () => {
        try {
          await service.getDeliveryZonesByLocality('Dz Key');
        } catch (error) {
          expect(error).toStrictEqual(new NotFoundException());
        }
      });
    });

    describe('when success for a delivery zone and distribution center with "Tradicional" distribution channel', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = [
          {
            key: 'antofagasta',
            label: 'Antofagasta',
            commune: 'antofagasta',
            dcCode: 'AM',
            dchDefault: '99999999-f30a-4be6-9bf2-93af3d1ed35e',
            dcLabel: 'Antofagasta',
            id: 'id',
            minimumOrderAmount: {
              currencyCode: 'CLP',
              type: 'string',
              fractionDigits: 0,
              centAmount: 5000
            }
          }
        ];
        response = await service.getDeliveryZones('antofagasta');
      });

      it('should call customObjectRepository.find', () => {
        expect(mockCustomObjectsRepository.find).toHaveBeenCalledWith({
          queryArgs: {
            limit: 500,
            where: ['container = "custom-object-delivery-zone.deliveryZoneContainer" and value(commune="antofagasta")']
          }
        });
      });

      it('should return customObjectRepository.getByContainerAndKey response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
