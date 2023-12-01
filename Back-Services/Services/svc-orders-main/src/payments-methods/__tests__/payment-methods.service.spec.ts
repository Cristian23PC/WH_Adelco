const mockCustomObjectsRepository = {
  find: jest.fn(({ queryArgs: { where } }) => {
    const paymentMethods = [
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
        key: 'CreditIncomplete',
        value: {
          enabled: true,
          description: 'Credit Card',
          dependsOnCreditLineStatus: true,
          displayAsPaymentOption: false
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
      },
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
    ];
    return Promise.resolve({
      results: [paymentMethods.find(method => method.key === where[2].split('"')[1].replace('"', ''))]
    });
  })
};

const mockConfigService = {
  get: (key: string) => (key === 'custom-object-payment-method.sapCashPaymentConditionCode' ? 'ZD01' : key)
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

  describe('getSelectedPaymentMethod', () => {
    let response;

    describe('when returning date check method', () => {
      const result = {
        key: 'DateCheck',
        sapPaymentCondition: 'ZD03',
        sapPaymentMethodCode: 'S'
      };
      beforeEach(async () => {
        response = await service.getSelectedMethod('DateCheck', 30);
      });
      it('should return payment methods for the provided business unit id with credit', async () => {
        expect(response).toEqual(result);
      });
    });

    describe('when returning credit method', () => {
      const result = {
        key: 'Credit',
        sapPaymentCondition: 'ZD07',
        sapPaymentMethodCode: ''
      };
      beforeEach(async () => {
        response = await service.getSelectedMethod('Credit', 30);
      });
      it('should return payment methods for the provided business unit id with credit', async () => {
        expect(response).toEqual(result);
      });
    });

    describe('when returning transfer method', () => {
      const result = {
        key: 'BankTransfer',
        sapPaymentCondition: 'ZD01',
        sapPaymentMethodCode: 'T'
      };
      beforeEach(async () => {
        response = await service.getSelectedMethod('BankTransfer', 30);
      });
      it('should return payment methods for the provided business unit id with credit', async () => {
        expect(response).toEqual(result);
      });
    });

    describe('when returning day check method', () => {
      const result = {
        key: 'DayCheck',
        sapPaymentCondition: 'ZD02',
        sapPaymentMethodCode: 'C'
      };
      beforeEach(async () => {
        response = await service.getSelectedMethod('DayCheck', 30);
      });
      it('should return payment methods for the provided business unit id with credit', async () => {
        expect(response).toEqual(result);
      });
    });

    describe('when returning incomplete method', () => {
      const result = {
        key: 'CreditIncomplete',
        sapPaymentCondition: '',
        sapPaymentMethodCode: ''
      };
      beforeEach(async () => {
        response = await service.getSelectedMethod('CreditIncomplete', 30);
      });
      it('should return payment methods for the provided business unit id with credit', async () => {
        expect(response).toEqual(result);
      });
    });

    describe('when returning cash method', () => {
      const result = {
        key: 'Cash',
        sapPaymentCondition: 'ZD01',
        sapPaymentMethodCode: 'E'
      };
      beforeEach(async () => {
        response = await service.getSelectedMethod('Cash', 0);
      });
      it('should return payment methods for the provided business unit id with credit', async () => {
        expect(response).toEqual(result);
      });
    });

    describe('when no methods are returned', () => {
      beforeEach(async () => {
        mockedCustomObjectsRepository.find.mockReturnValueOnce({ results: [] } as any);
        try {
          await service.getSelectedMethod('Cash', 0);
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
