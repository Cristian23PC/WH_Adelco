import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockChannelsRepository = {
  getById: jest.fn(id =>
    id === 'error'
      ? Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The Resource with ID 'error' was not found.",
            errors: [
              {
                code: 'ResourceNotFound',
                message: "The Resource with ID 'error' was not found."
              }
            ]
          })
        )
      : Promise.resolve({
          id: 'id',
          key: 'key',
          roles: ['ProductDistribution']
        })
  )
};

jest.mock('commercetools-sdk-repositories', () => ({
  ChannelsRepository: jest.fn().mockImplementation(() => mockChannelsRepository)
}));

const mockConfigService = {
  get: (key: string) => key
};

const mockLoggerService = {
  log: jest.fn()
};

const mockCache = {
  get: jest.fn(data => Promise.resolve(data)),
  set: jest.fn(() => Promise.resolve())
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

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService),
  registerAs: jest.fn(() => mockRegisterAs)
}));

jest.mock('@/common/utils/logger/logger.service', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { Channel } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelsRepository } from 'commercetools-sdk-repositories';
import { ChannelsService } from '../channels.service';

describe('ChannelsService', () => {
  let service: ChannelsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChannelsService, ChannelsRepository, ConfigService, { provide: CACHE_MANAGER, useValue: mockCache }]
    }).compile();

    service = module.get<ChannelsService>(ChannelsService);
  });

  describe('getChannel', () => {
    let response: CommercetoolsError | Channel;
    let channelId: string;

    describe('when channelsRepository.getById succeeds', () => {
      let expectedResponse;

      beforeAll(() => {
        expectedResponse = {
          id: 'id',
          key: 'key',
          roles: ['ProductDistribution']
        };
      });

      describe('when channeld ID matches', () => {
        beforeAll(() => {
          channelId = 'id';
        });

        beforeEach(async () => {
          mockCache.get.mockReturnValue(Promise.resolve(false));
          response = await service.getChannel(channelId);
        });

        it('should call channelsRepository.getById', () => {
          expect(mockChannelsRepository.getById).toHaveBeenCalledWith(channelId);
        });

        it('should return channelsRepository.getById response', () => {
          expect(response).toEqual(expectedResponse);
        });

        it('should cache channel', () => {
          expect(mockCache.set).toHaveBeenCalled();
        });
      });
    });

    describe('when channelsRepository.getById rejects', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = new CommercetoolsError({
          statusCode: 404,
          message: "The Resource with ID 'error' was not found.",
          errors: [
            {
              code: 'ResourceNotFound',
              message: "The Resource with ID 'error' was not found."
            }
          ]
        });
        channelId = 'error';
        try {
          await service.getChannel(channelId);
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call channelsRepository.getById', () => {
        expect(mockChannelsRepository.getById).toHaveBeenCalledWith(channelId);
      });

      it('should throw channelsRepository.getById error', () => {
        expect(response).toEqual(expectedResponse);
      });
    });

    describe('when the channel is cached', () => {
      beforeEach(async () => {
        mockCache.get.mockReturnValue(Promise.resolve(true));
        await service.getChannel(channelId);
      });

      afterEach(() => {
        mockCache.get.mockReset();
      });

      it('should call loggerService.log', () => {
        expect(mockLoggerService.log).toHaveBeenCalledWith('Cache hit: Channel');
      });
    });
  });
});
