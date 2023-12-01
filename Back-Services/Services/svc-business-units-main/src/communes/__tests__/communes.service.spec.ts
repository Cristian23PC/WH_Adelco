const mockCustomObjectsRepository = {
  find: jest.fn(() => {
    return Promise.resolve({
      results: [
        {
          id: 'id',
          container: 'commune',
          key: 'key',
          value: {
            label: 'Label',
            region: 'region'
          }
        }
      ]
    });
  }),
  getByContainerAndKey: jest.fn((container: string, communeKey: string) => {
    if (communeKey === 'no-commune') return undefined;
    if (communeKey === 'error') throw new Error('Commercetools error');

    const { key, ...value } = mockCommunesResponse[0];
    return { value: value, key };
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

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { CommunesService } from '../communes.service';
import { Commune } from '../models';
import { mockCommunesResponse } from '../__mocks__/communes.mock';

describe('CommunesService', () => {
  let service: CommunesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommunesService, CustomObjectsRepository, ConfigService]
    }).compile();

    service = module.get<CommunesService>(CommunesService);
  });

  describe('getCommunes', () => {
    let response: Error | Commune[];

    describe('when success', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = [{ key: 'key', label: 'Label', region: 'region' }];
        response = await service.getCommunes('region');
      });

      it('should call customObjectRepository.find', () => {
        expect(mockCustomObjectsRepository.find).toHaveBeenCalledWith({
          queryArgs: {
            limit: 500,
            where: ['container = "custom-object-commune.communesContainer" and value(region="region")']
          }
        });
      });

      it('should return customObjectRepository.getByContainerAndKey response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('getCommune', () => {
    let response: Error | Commune;
    let communeKey: string;
    const container = 'custom-object-commune.communesContainer';

    beforeEach(async () => {
      response = await service.getCommune('commune');
    });

    describe('when requesting a valid commune', () => {
      beforeAll(() => {
        communeKey = 'valid';
      });

      beforeEach(async () => {
        response = await service.getCommune(communeKey);
      });

      it('should call mockCustomObjectsRepository.getByContainerAndKey', () => {
        expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(container, communeKey);
      });

      it('should return expected response with commune ', () => {
        expect(response).toEqual(mockCommunesResponse[0]);
      });
    });

    describe('when requesting a invalid commune', () => {
      beforeAll(() => {
        communeKey = 'no-commune';
      });

      beforeEach(async () => {
        response = await service.getCommune(communeKey);
      });

      it('should call mockCustomObjectsRepository.getByContainerAndKey', () => {
        expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(container, communeKey);
      });

      it('should return expected response with commune', () => {
        expect(response).toBeUndefined();
      });
    });

    describe('when thrown an error CT', () => {
      beforeAll(() => {
        communeKey = 'error';
      });

      beforeEach(async () => {
        try {
          await service.getCommune(communeKey);
        } catch (error) {
          response = error as Error;
        }
      });

      it('should call mockCustomObjectsRepository.getByContainerAndKey', () => {
        expect(mockCustomObjectsRepository.getByContainerAndKey).toHaveBeenCalledWith(container, communeKey);
      });

      it('should return expected response with commune', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });
});
