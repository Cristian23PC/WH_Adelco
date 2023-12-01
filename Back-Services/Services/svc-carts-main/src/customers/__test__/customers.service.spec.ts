const mockCustomersRepository = {
  find: jest.fn((methodArgs: { queryArgs: { where: string[] } }) => {
    if (methodArgs.queryArgs.where[0].indexOf('not-found@mail.com') >= 0) {
      return Promise.resolve({ results: [] });
    }
    return Promise.resolve({ results: [mockCommercetoolsCustomerResponse] });
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CustomersRepository: jest.fn().mockImplementation(() => mockCustomersRepository)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { Customer } from '@commercetools/platform-sdk';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersRepository } from 'commercetools-sdk-repositories';
import { CustomersService } from '../customers.service';
import { mockCommercetoolsCustomerResponse } from '../__mocks__/customers.mock';

describe('CustomersService', () => {
  let service: CustomersService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, CustomersRepository]
    }).compile();

    service = module.get<CustomersService>(CustomersService);
  });

  describe('getCustomerByEmail', () => {
    let response: NotFoundException | CommercetoolsError | Customer;

    describe('when success', () => {
      let expectedResponse;

      describe('when customers are found', () => {
        beforeEach(async () => {
          expectedResponse = mockCommercetoolsCustomerResponse;
          response = await service.getCustomerByEmail('johndoe@mail.com');
        });

        it('should call CustomersRepository.find', () => {
          expect(mockCustomersRepository.find).toHaveBeenCalledWith({
            queryArgs: {
              where: ['email = "johndoe@mail.com"']
            }
          });
        });

        it('should return CustomersPagedQueryResponse with results', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when no customers are found', () => {
        beforeEach(async () => {
          response = await service.getCustomerByEmail('not-found@mail.com');
        });

        it('should call CustomersRepository.find', () => {
          expect(mockCustomersRepository.find).toHaveBeenCalledWith({
            queryArgs: {
              where: ['email = "not-found@mail.com"']
            }
          });
        });

        it('should return undefined', () => {
          expect(response).toBeUndefined();
        });
      });
    });
  });
});
