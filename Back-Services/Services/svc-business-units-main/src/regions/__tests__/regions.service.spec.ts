const mockCustomObjectsRepository = {
  find: jest.fn(() => {
    return Promise.resolve({
      results: [
        {
          id: 'id',
          container: 'region',
          key: 'key',
          value: {
            label: 'Label'
          }
        }
      ]
    });
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
import { RegionsService } from '../regions.service';
import { Region } from '../models';

describe('RegionsService', () => {
  let service: RegionsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegionsService, CustomObjectsRepository, ConfigService]
    }).compile();

    service = module.get<RegionsService>(RegionsService);
  });

  describe('getRegions', () => {
    let response: Error | Region[];

    describe('when success', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = [{ key: 'key', label: 'Label' }];
        response = await service.getRegions();
      });

      it('should call customObjectRepository.find', () => {
        expect(mockCustomObjectsRepository.find).toHaveBeenCalledWith({
          queryArgs: {
            limit: 500,
            where: ['container = "custom-object.regionsContainer"']
          }
        });
      });

      it('should return customObjectRepository.getByContainerAndKey response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
