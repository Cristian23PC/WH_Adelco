import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ChannelsService } from '@/channels/channels.service';
import { DistributionCentersService } from '../distribution-centers.service';
import { Channel } from '@commercetools/platform-sdk';

const mockCache = {
  get: jest.fn(() => Promise.resolve({ LB: { key: 'LB', id: 'lb-id' }, IM: { key: 'IM', id: 'im-id' } })),
  set: jest.fn(() => Promise.resolve())
};

const mockChannelsService = {
  getSupplyChannels: jest.fn(() =>
    Promise.resolve([
      { key: 'LB', id: 'lb-id' },
      { key: 'IM', id: 'im-id' }
    ])
  )
};

jest.mock('cache-manager', () => ({ Cache: jest.fn().mockImplementation(() => mockCache) }));
jest.mock('@/channels/channels.service', () => ({ ChannelsService: jest.fn().mockImplementation(() => mockChannelsService) }));

describe('DistributionCentersService', () => {
  let service: DistributionCentersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: CACHE_MANAGER, useValue: mockCache }, ChannelsService, DistributionCentersService]
    }).compile();

    service = module.get<DistributionCentersService>(DistributionCentersService);
  });

  describe('getByKey', () => {
    let key: string;
    let response: Channel;

    describe('when distribution center is cached', () => {
      beforeEach(async () => {
        key = 'LB';
        response = await service.getByKey(key);
      });

      test('should call cacheManager.get', () => {
        expect(mockCache.get).toHaveBeenCalledWith('distribution-centers-key');
      });

      test('should return cached distribution center', () => {
        expect(response).toEqual({ key: 'LB', id: 'lb-id' });
      });
    });

    describe('when distribution center is not cached', () => {
      beforeEach(async () => {
        key = 'LB';
        mockCache.get.mockImplementation(() => null);
        response = await service.getByKey(key);
      });

      test('should call cacheManager.get', () => {
        expect(mockCache.get).toHaveBeenCalledWith('distribution-centers-key');
      });

      test('should call channelsService.getSupplyChannels', () => {
        expect(mockChannelsService.getSupplyChannels).toHaveBeenCalled();
      });

      test('should call cacheManager.set', () => {
        expect(mockCache.set).toHaveBeenCalledWith('distribution-centers-key', { LB: { key: 'LB', id: 'lb-id' }, IM: { key: 'IM', id: 'im-id' } }, 30 * 24 * 60 * 60);
      });

      test('should return cached distribution center', () => {
        expect(response).toEqual({ key: 'LB', id: 'lb-id' });
      });
    });
  });
});
