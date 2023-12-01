const mockCustomObjectsRepository = {
  find: jest.fn(param => {
    const nonCreditMethods = [
      {
        key: 'BankTransfer',
        value: {
          enabled: true,
          description: 'Transferencia',
          dependsOnCreditLineStatus: false,
          displayAsPaymentOption: false,
          sapMethod: 'T',
          sapConditions: {
            '0': 'ZD16'
          }
        }
      },
      {
        key: 'Cash',
        value: {
          enabled: true,
          description: 'Efectivo',
          dependsOnCreditLineStatus: false,
          displayAsPaymentOption: true,
          sapMethod: 'E',
          sapConditions: {
            '0': 'ZD01'
          }
        }
      }
    ];
    if (!param.queryArgs.where.includes('value(dependsOnCreditLineStatus=false)')) {
      return Promise.resolve({
        results: [
          ...nonCreditMethods,
          {
            key: 'DayCheck',
            value: {
              enabled: true,
              description: 'Cheque al día',
              dependsOnCreditLineStatus: true,
              displayAsPaymentOption: true,
              sapMethod: 'C',
              sapConditions: {
                '1': 'ZD02'
              }
            }
          },
          {
            key: 'DateCheck',
            value: {
              enabled: true,
              description: 'Cheque a fecha a %TERM% días',
              dependsOnCreditLineStatus: true,
              displayAsPaymentOption: true,
              sapMethod: 'S',
              sapConditions: {
                '5': 'ZD21',
                '7': 'ZD22',
                '10': 'ZD23',
                '15': 'ZD24',
                '30': 'ZD03',
                '60': 'ZD05'
              }
            }
          },
          {
            key: 'Credit',
            value: {
              enabled: true,
              description: 'crédito simple a %TERM% días',
              dependsOnCreditLineStatus: true,
              displayAsPaymentOption: true,
              sapMethod: '',
              sapConditions: {
                '5': 'ZD18',
                '7': 'ZD25',
                '10': 'ZD19',
                '15': 'ZD20',
                '30': 'ZD07',
                '45': 'ZD08',
                '60': 'ZD09',
                '60G': 'ZD12',
                '75G': 'ZD13',
                '90G': 'ZD14',
                '120': 'ZD27'
              }
            }
          }
        ]
      });
    }
    return Promise.resolve({
      results: nonCreditMethods
    });
  })
};

const mockConfigService = {
  get: (key: string) => key
};

import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsMethodsService } from '../payment-methods.service';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { NotFoundException } from '@nestjs/common';

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
    const includeCreditLineDetails = false;
    const creditLineDetails = {
      creditLimit: 10000,
      creditTermDays: 30,
      creditExcessTolerance: 5000,
      isCreditBlocked: false
    };
    const expectedResult = {
      paymentMethods: [
        {
          key: 'BankTransfer',
          description: 'Transferencia',
          condition: 'ZD16',
          termDays: 0
        },
        {
          key: 'Cash',
          description: 'Efectivo',
          condition: 'ZD01',
          termDays: 0
        }
      ]
    };
    let response;

    describe('when returning credit line methods', () => {
      const result = {
        paymentMethods: [
          ...expectedResult.paymentMethods,
          {
            key: 'DayCheck',
            description: 'Cheque al día',
            condition: 'ZD02',
            termDays: 1
          },
          {
            key: 'DateCheck',
            description: 'Cheque a fecha a 30 días',
            condition: 'ZD03',
            termDays: 30
          },
          {
            key: 'Credit',
            description: 'crédito simple a 30 días',
            condition: 'ZD07',
            termDays: 30
          }
        ]
      };
      beforeEach(async () => {
        response = await service.getEnabledPaymentMethods(true, creditLineDetails);
      });
      it('should return payment methods for the provided business unit id with credit', async () => {
        expect(response).toEqual(result);
      });
    });

    describe('when returning credit non line methods only', () => {
      beforeEach(async () => {
        response = await service.getEnabledPaymentMethods(includeCreditLineDetails, creditLineDetails);
      });
      it('should return payment methods for the provided business unit id with credit', async () => {
        expect(response).toEqual(expectedResult);
      });
    });

    describe('when no methods are returned', () => {
      beforeEach(async () => {
        mockedCustomObjectsRepository.find.mockReturnValueOnce({ results: [] } as any);
        try {
          await service.getEnabledPaymentMethods(includeCreditLineDetails, creditLineDetails);
        } catch (e) {
          response = e;
        }
      });
      it('should throw a 404 code when there are no enabled payments methods', async () => {
        await expect(response).toEqual(new NotFoundException());
      });
    });
  });
});
