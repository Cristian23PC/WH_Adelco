const mockCustomObjectsRepository = {
  getByContainerAndKey: jest.fn((container, key) => {
    switch (key) {
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
        return Promise.resolve(mockDeliveryZonesResponse);
    }
  }),
  findByContainer: jest.fn((_, methodArgs: { queryArgs: { where: string[] } }) => {
    if (methodArgs.queryArgs.where.includes('id="not-found-delivery-zone-id"')) {
      return Promise.resolve({ results: [] });
    }
    if (methodArgs.queryArgs.where.includes('id="commercetools-fail"')) {
      throw new Error('Commercetools error');
    }

    return Promise.resolve({ results: [mockDeliveryZonesResponse] });
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CustomObjectsRepository: jest.fn().mockImplementation(() => mockCustomObjectsRepository)
}));

const mockConfigService = {
  get: (key: string) => key
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { CustomObject } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { DeliveryZonesService } from '../delivery-zones.service';
import { mockDeliveryZonesResponse } from '../__mocks__/delivery-zones.mock';

describe('CustomObjects', () => {
  let service: DeliveryZonesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryZonesService, CustomObjectsRepository, ConfigService]
    }).compile();

    service = module.get<DeliveryZonesService>(DeliveryZonesService);
  });

  describe('getT2Zone', () => {
    let response: CommercetoolsError | CustomObject;
    let t2zoneKey: string;
    const container = 'custom-object.t2zoneContainer';

    describe('when customObjectRepository.getByContainerAndKey succeeds', () => {
      let expectedResponse;

      beforeAll(() => {
        expectedResponse = {
          id: 'id',
          container: 'container',
          key: 'key',
          value: {
            label: 'Label',
            t2Rate: '0.1',
            dcCode: 'dc',
            deliveryZoneCode: 'H013',
            regionCode: '08',
            commune: 'antuco',
            defaultSalesBranch: '100',
            dcLabel: 'Sur Medio',
            method: 'Delivery',
            cutoffTime: ['23:59'],
            deliveryDays: [5],
            deliveryRange: 0,
            preparationTime: 2,
            frequency: 'W',
            isAvailable: true
          }
        };
      });

      describe('when zone ID matches', () => {
        beforeAll(() => {
          t2zoneKey = 'key';
        });

        beforeEach(async () => {
          response = await service.getT2Zone(t2zoneKey);
        });

        it('should call customObjectRepository.getByContainerAndKey', () => {
          expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(container, t2zoneKey);
        });

        it('should return customObjectRepository.getByContainerAndKey response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });

    describe('when customObjectRepository.getByContainerAndKey rejects', () => {
      const expectedResponse = new CommercetoolsError({
        statusCode: 404,
        message: "The CustomObject with ID '(container,error)' was not found.",
        errors: [
          {
            code: 'InvalidSubject',
            message: "The CustomObject with ID '(container,error)' was not found."
          }
        ]
      });
      beforeEach(async () => {
        t2zoneKey = 'error';
        try {
          await service.getT2Zone(t2zoneKey);
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call customObjectRepository.getByContainerAndKey', () => {
        expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(container, t2zoneKey);
      });

      it('should throw customObjectRepository.getByContainerAndKey error', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
