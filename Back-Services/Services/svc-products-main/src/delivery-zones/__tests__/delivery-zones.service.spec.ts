import { CACHE_MANAGER } from '@nestjs/cache-manager';

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
        return Promise.resolve({
          id: 'id',
          container: 'container',
          key: 'key',
          value: {
            label: 'Label',
            t2Rate: '0.1',
            dcCode: 'dc'
          }
        });
    }
  })
};

const mockCache = {
  get: jest.fn(data => Promise.resolve(data)),
  set: jest.fn(() => Promise.resolve())
};

const mockLoggerService = {
  log: jest.fn()
};

const mockRegisterAs = () => ({
  pinoHttp: {
    customProps: () => ({
      context: 'HTTP'
    }),
    transport: {
      target: 'pino-pretty',
      options: {
        sync: true,
        singleLine: true
      }
    }
  }
});

jest.mock('commercetools-sdk-repositories', () => ({
  CustomObjectsRepository: jest.fn().mockImplementation(() => mockCustomObjectsRepository)
}));

const mockConfigService = {
  get: (key: string) => key
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService),
  registerAs: jest.fn(() => mockRegisterAs)
}));

jest.mock('@/common/utils/logger/logger.service', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { CustomObject } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { DeliveryZonesService } from '../delivery-zones.service';

describe('CustomObjects', () => {
  let service: DeliveryZonesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryZonesService, CustomObjectsRepository, ConfigService, { provide: CACHE_MANAGER, useValue: mockCache }]
    }).compile();

    service = module.get<DeliveryZonesService>(DeliveryZonesService);
  });

  describe('getT2Zone', () => {
    let response: CommercetoolsError | CustomObject;
    let t2zoneKey: string;

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
            dcCode: 'dc'
          }
        };
      });

      describe('when zone ID matches', () => {
        beforeAll(() => {
          t2zoneKey = 'key';
        });

        beforeEach(async () => {
          mockCache.get.mockReturnValue(Promise.resolve(false));
          response = await service.getT2Zone(t2zoneKey);
        });

        it('should call customObjectRepository.getByContainerAndKey', () => {
          expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(undefined, t2zoneKey);
        });

        it('should return customObjectRepository.getByContainerAndKey response', () => {
          expect(response).toEqual(expectedResponse);
        });

        it('should cache channel', () => {
          expect(mockCache.set).toHaveBeenCalled();
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
        expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(undefined, t2zoneKey);
      });

      it('should throw customObjectRepository.getByContainerAndKey error', () => {
        expect(response).toEqual(expectedResponse);
      });
    });

    describe('when the t2z is cached', () => {
      beforeEach(async () => {
        mockCache.get.mockReturnValue(Promise.resolve(true));
        response = await service.getT2Zone(t2zoneKey);
      });

      afterEach(() => {
        mockCache.get.mockReset();
      });

      it('should call loggerService.log', () => {
        expect(mockLoggerService.log).toHaveBeenCalledWith('Cache hit: t2zone');
      });
    });
  });
});
