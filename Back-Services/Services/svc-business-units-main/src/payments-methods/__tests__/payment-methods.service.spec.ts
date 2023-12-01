const mockCustomObjectsRepository = {
  find: jest.fn(() =>
    Promise.resolve({
      results: [
        {
          key: 'bank-transfer'
        },
        {
          key: 'cash'
        }
      ]
    })
  )
};

const mockConfigService = {
  get: (key: string) => key
};

import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsMethodsService } from '../payment-methods.service';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

jest.mock('commercetools-sdk-repositories', () => ({
  CustomObjectsRepository: jest.fn().mockImplementation(() => mockCustomObjectsRepository)
}));

describe('PaymentsMethodsService', () => {
  let service: PaymentsMethodsService;
  let mockedCustomObjectsRepository: jest.Mocked<CustomObjectsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentsMethodsService, CustomObjectsRepository, ConfigService]
    }).compile();

    service = module.get<PaymentsMethodsService>(PaymentsMethodsService);
    mockedCustomObjectsRepository = module.get<CustomObjectsRepository>(CustomObjectsRepository) as jest.Mocked<CustomObjectsRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEnabledPaymentMethods', () => {
    it('should return payment methods for the provided business unit id', async () => {
      const buId = 'test';
      const expectedResult = {
        paymentMethods: [{ key: 'bank-transfer' }, { key: 'cash' }]
      };
      expect(await service.getEnabledPaymentMethods(buId)).toEqual(expectedResult);
    });

    it('should throw a 404 code when there are no enabled payments methods', async () => {
      mockedCustomObjectsRepository.find.mockReturnValueOnce({ results: [] } as any);
      const buId = 'test';

      await expect(service.getEnabledPaymentMethods(buId)).rejects.toThrow('Not Found');
    });
  });
});
