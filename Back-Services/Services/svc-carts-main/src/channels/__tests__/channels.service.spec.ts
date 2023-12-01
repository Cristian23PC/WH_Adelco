const mockChannelsRepository = {
  find: jest.fn().mockImplementation(({ queryArgs: { where } }) =>
    Promise.resolve({
      results: [
        {
          id: 'id',
          key: 'key',
          roles: [where[0].indexOf('InventorySupply') > 0 ? 'InventorySupply' : 'ProductDistribution']
        }
      ]
    })
  )
};

jest.mock('commercetools-sdk-repositories', () => ({
  ChannelsRepository: jest.fn().mockImplementation(() => mockChannelsRepository)
}));

const mockConfigService = {
  get: () => 7200000
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { Channel } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsRepository } from 'commercetools-sdk-repositories';
import { ChannelsService } from '../channels.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockCache = {
  get: jest.fn(() => Promise.resolve(null)),
  set: jest.fn(() => Promise.resolve())
};

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsService, ChannelsRepository, ConfigService, { provide: CACHE_MANAGER, useValue: mockCache }]
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  describe('getSupplyChannels', () => {
    let response: CommercetoolsError | Channel[];

    describe('when channelsRepository.find succeeds', () => {
      let expectedResponse;

      beforeAll(() => {
        expectedResponse = [
          {
            id: 'id',
            key: 'key',
            roles: ['InventorySupply']
          }
        ];
      });

      describe('when channels are returned', () => {
        beforeEach(async () => {
          response = await service.getSupplyChannels();
        });
        it('should call cache.get', () => {
          expect(mockCache.get).toHaveBeenCalled();
        });

        it('should call channelsRepository.find', () => {
          expect(mockChannelsRepository.find).toHaveBeenCalled();
        });

        it('should call cache.set', () => {
          expect(mockCache.set).toHaveBeenCalledWith('supplyChannels', expectedResponse, 7200000);
        });

        it('should return channelsRepository.find response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when channels are returned from cache', () => {
        beforeEach(async () => {
          mockCache.get.mockResolvedValueOnce([
            {
              id: 'id',
              key: 'key',
              roles: ['InventorySupply']
            }
          ]);
          response = await service.getSupplyChannels();
        });
        it('should call cache.get', () => {
          expect(mockCache.get).toHaveBeenCalled();
        });

        it('should call channelsRepository.find', () => {
          expect(mockChannelsRepository.find).not.toHaveBeenCalled();
        });

        it('should return channelsRepository.find response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });
  });

  describe('getDefaultChannelForDistributionCenter', () => {
    let response: CommercetoolsError | Channel;

    describe('when channelsRepository.find succeeds', () => {
      let expectedResponse;

      beforeAll(() => {
        expectedResponse = {
          id: 'id',
          key: 'key',
          roles: ['ProductDistribution']
        };
      });

      describe('when channels are returned', () => {
        beforeEach(async () => {
          response = await service.getDefaultChannelForDistributionCenter('dcCode');
        });

        it('should call cache.get', () => {
          expect(mockCache.get).toHaveBeenCalled();
        });

        it('should call channelsRepository.find', () => {
          expect(mockChannelsRepository.find).toHaveBeenCalled();
        });

        it('should call cache.set', () => {
          expect(mockCache.set).toHaveBeenCalledWith('dcCode', expectedResponse, 7200000);
        });

        it('should return channelsRepository.find response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when channels are returned from cache', () => {
        beforeEach(async () => {
          mockCache.get.mockResolvedValueOnce({
            id: 'id',
            key: 'key',
            roles: ['ProductDistribution']
          });
          response = await service.getDefaultChannelForDistributionCenter('dcCode');
        });

        it('should call cache.get', () => {
          expect(mockCache.get).toHaveBeenCalled();
        });

        it('should call channelsRepository.find', () => {
          expect(mockChannelsRepository.find).not.toHaveBeenCalled();
        });

        it('should return channelsRepository.find response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });
  });
});
