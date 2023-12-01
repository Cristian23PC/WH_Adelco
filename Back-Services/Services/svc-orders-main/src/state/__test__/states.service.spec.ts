const mockStatesRepository = {
  getByKey: jest.fn((key: KeyState) => {
    if (key === ('error' as KeyState)) {
      throw new CommercetoolsError({
        statusCode: 404,
        message: "The State with KEY 'error' was not found.",
        errors: [
          {
            code: 'InvalidSubject',
            message: "The State with KEY 'error' was not found."
          }
        ]
      });
    }

    return Promise.resolve(mockStateResponse);
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  StatesRepository: jest.fn().mockImplementation(() => mockStatesRepository)
}));

const mockCache = {
  get: jest.fn(key => {
    if (key === `STATE_${KEY_ORDER_STATE.OPEN}` || key === 'STATE_error') {
      return Promise.resolve();
    }

    return Promise.resolve(mockStateResponse);
  }),
  set: jest.fn(() => Promise.resolve())
};

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'state.orderStateCacheTTL':
        return 31536000000;
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { Test, TestingModule } from '@nestjs/testing';
import { StatesRepository } from 'commercetools-sdk-repositories';
import { KeyState } from '../states.interface';
import { StatesService } from '../states.service';
import { State } from '@commercetools/platform-sdk';
import { mockStateResponse } from '../__mocks__/states.mock';
import { KEY_ORDER_STATE } from '@/orders/orders.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

describe('StatesService', () => {
  let service: StatesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StatesService, StatesRepository, { provide: CACHE_MANAGER, useValue: mockCache }, ConfigService]
    }).compile();

    service = module.get<StatesService>(StatesService);
  });

  describe('getByKey', () => {
    let response: CommercetoolsError | State;

    describe('when state is not cached', () => {
      describe('when StatesRepository.getByKey succeeds', () => {
        beforeEach(async () => {
          response = await service.getByKey(KEY_ORDER_STATE.OPEN);
        });

        it('should call StatesRepository.getByKey', () => {
          expect(mockStatesRepository.getByKey).toHaveBeenCalledWith(KEY_ORDER_STATE.OPEN);
        });

        it('should return StatesRepository.getByKey response', () => {
          expect(response).toEqual(mockStateResponse);
        });
      });

      describe('when StatesRepository.getByKey rejects', () => {
        beforeEach(async () => {
          try {
            await service.getByKey('error' as KeyState);
          } catch (e) {
            response = e as CommercetoolsError;
          }
        });

        it('should call StatesRepository.getByKey', () => {
          expect(mockStatesRepository.getByKey).toHaveBeenCalledWith('error');
        });

        it('should throw StatesRepository.getByKey error', () => {
          expect(response).toEqual(
            new CommercetoolsError({
              statusCode: 404,
              message: "The State with KEY 'error' was not found.",
              errors: [
                {
                  code: 'InvalidSubject',
                  message: "The State with KEY 'error' was not found."
                }
              ]
            })
          );
        });
      });
    });

    describe('when state is cached', () => {
      describe('when StatesRepository.getByKey succeeds', () => {
        beforeEach(async () => {
          response = await service.getByKey('KeyState' as KeyState);
        });

        it('should not call StatesRepository.getByKey', () => {
          expect(mockStatesRepository.getByKey).not.toHaveBeenCalled();
        });

        it('should return cached response', () => {
          expect(response).toEqual(mockStateResponse);
        });
      });
    });
  });
});
