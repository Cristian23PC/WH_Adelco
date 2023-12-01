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
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { IDeliveryZoneValue } from '../delivery-zones.interface';
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

  describe('getAndValidateDeliveryZone', () => {
    let response: CommercetoolsError | IDeliveryZoneValue;
    let spy: jest.SpyInstance;

    describe('when success', () => {
      beforeEach(async () => {
        spy = jest.spyOn(service, 'getT2Zone').mockImplementation(() =>
          Promise.resolve({
            id: 'id',
            container: 'container',
            key: 't2zone',
            value: {
              label: 'Label',
              t2Rate: '0.1',
              dcCode: 'dc'
            }
          } as CustomObject)
        );
        response = await service.getAndValidateDeliveryZone('t2zone');
      });

      it('should call getT2Zone', () => {
        expect(spy).toHaveBeenCalledWith('t2zone');
      });

      it('should return t2zone and dcCode', () => {
        expect(response).toEqual({ dcCode: 'dc', t2Rate: '0.1' });
      });
    });

    describe('when not return deliveryZone', () => {
      beforeEach(async () => {
        spy = jest.spyOn(service, 'getT2Zone').mockImplementation(() => Promise.resolve({} as CustomObject));
        try {
          await service.getAndValidateDeliveryZone('t2zone');
        } catch (error) {
          response = error;
        }
      });

      it('should call getT2Zone', () => {
        expect(spy).toHaveBeenCalledWith('t2zone');
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('Delivery zone missing data'));
      });
    });

    describe('when return delivery zone without t2Rate', () => {
      beforeEach(async () => {
        spy = jest.spyOn(service, 'getT2Zone').mockImplementation(() =>
          Promise.resolve({
            id: 'id',
            container: 'container',
            key: 't2zone',
            value: {
              label: 'Label',
              dcCode: 'dc'
            }
          } as CustomObject)
        );
        try {
          await service.getAndValidateDeliveryZone('t2zone');
        } catch (error) {
          response = error;
        }
      });

      it('should call getT2Zone', () => {
        expect(spy).toHaveBeenCalledWith('t2zone');
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('Delivery zone missing data'));
      });
    });

    describe('when return delivery zone without dcCode', () => {
      beforeEach(async () => {
        spy = jest.spyOn(service, 'getT2Zone').mockImplementation(() =>
          Promise.resolve({
            id: 'id',
            container: 'container',
            key: 't2zone',
            value: {
              label: 'Label',
              t2Rate: '0.1'
            }
          } as CustomObject)
        );
        try {
          await service.getAndValidateDeliveryZone('t2zone');
        } catch (error) {
          response = error;
        }
      });

      it('should call getT2Zone', () => {
        expect(spy).toHaveBeenCalledWith('t2zone');
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('Delivery zone missing data'));
      });
    });
  });

  describe('getById', () => {
    let response: CustomObject | Error;

    describe('when get Delivery Zone successfully', () => {
      beforeEach(async () => {
        response = await service.getById('delivery-zone-id');
      });

      it('should call CustomObjectRepository.findByContainer', () => {
        expect(mockCustomObjectsRepository.findByContainer).toHaveBeenCalledWith('custom-object.t2zoneContainer', { queryArgs: { where: ['id="delivery-zone-id"'] } });
      });

      it('should get DeliveryZone successfully', () => {
        expect(response).toEqual(mockDeliveryZonesResponse);
      });
    });

    describe('when Delivery Zone not found', () => {
      beforeEach(async () => {
        try {
          await service.getById('not-found-delivery-zone-id');
        } catch (error) {
          response = error;
        }
      });

      it('should call CustomObjectRepository.findByContainer', () => {
        expect(mockCustomObjectsRepository.findByContainer).toHaveBeenCalledWith('custom-object.t2zoneContainer', { queryArgs: { where: ['id="not-found-delivery-zone-id"'] } });
      });

      it('should get DeliveryZone successfully', () => {
        expect(response).toEqual(new NotFoundException('Delivery zone not found'));
      });
    });

    describe('when commercetools fail', () => {
      beforeEach(async () => {
        try {
          await service.getById('commercetools-fail');
        } catch (error) {
          response = error;
        }
      });

      it('should call CustomObjectRepository.findByContainer', () => {
        expect(mockCustomObjectsRepository.findByContainer).toHaveBeenCalledWith('custom-object.t2zoneContainer', { queryArgs: { where: ['id="commercetools-fail"'] } });
      });

      it('should get DeliveryZone successfully', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });
});
