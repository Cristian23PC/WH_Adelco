const mockCustomersRepository = {
  find: jest.fn((methodArgs: { queryArgs: { where: string[] } }) => {
    if (methodArgs.queryArgs.where[0].indexOf('not-found@mail.com') >= 0) {
      return Promise.resolve({ results: [] });
    }
    if (methodArgs.queryArgs.where[0].indexOf('invalidsearch') >= 0) {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorMalformed));
    }
    return Promise.resolve({ results: [mockCommercetoolsCustomerResponse] });
  }),
  create: jest.fn((request: { body: { email: string } }) => {
    if (request.body.email === 'invalidCreate') {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorMalformed));
    }

    return Promise.resolve(mockCustomerSignInResult);
  }),
  deleteById: jest.fn(() => {
    return Promise.resolve(mockCommercetoolsCustomerResponse);
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CustomersRepository: jest.fn().mockImplementation(() => mockCustomersRepository)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { Customer, CustomerSignInResult } from '@commercetools/platform-sdk';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersRepository } from 'commercetools-sdk-repositories';
import { CustomersService } from '../customers.service';
import { mockCommercetoolsCustomerResponse, mockCustomerSignInResult } from '../__mocks__/customers.mock';
import { mockCommercetoolsErrorMalformed } from '@/business-units-users/__mocks__/business-units-users.mock';

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
              limit: 1,
              where: ['lowercaseEmail = "johndoe@mail.com"']
            }
          });
        });

        it('should return CustomersPagedQueryResponse with results', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when no customers are found', () => {
        beforeEach(async () => {
          expectedResponse = new NotFoundException('Customer not found');
          try {
            await service.getCustomerByEmail('not-found@mail.com');
          } catch (e) {
            response = e as NotFoundException;
          }
        });

        it('should call CustomersRepository.find', () => {
          expect(mockCustomersRepository.find).toHaveBeenCalledWith({
            queryArgs: {
              limit: 1,
              where: ['lowercaseEmail = "not-found@mail.com"']
            }
          });
        });

        it('should return a 404 Error', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = new CommercetoolsError(mockCommercetoolsErrorMalformed);
        try {
          await service.getCustomerByEmail('invalidSearch');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CustomersRepository.find', () => {
        expect(mockCustomersRepository.find).toHaveBeenCalledWith({
          queryArgs: {
            limit: 1,
            where: ['lowercaseEmail = "invalidsearch"']
          }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('createCustomer', () => {
    let response: CommercetoolsError | CustomerSignInResult;

    describe('when success', () => {
      describe('when create customer successfully', () => {
        beforeEach(async () => {
          response = await service.createCustomer({
            email: 'johndoe@mail.com'
          });
        });

        it('should call CustomersRepository.create', () => {
          expect(mockCustomersRepository.create).toHaveBeenCalledWith({ body: { email: 'johndoe@mail.com' } });
        });

        it('should return CustomerSignInResult', () => {
          expect(response).toEqual(mockCustomerSignInResult);
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      beforeEach(async () => {
        try {
          await service.createCustomer({
            email: 'invalidCreate'
          });
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CustomersRepository.create', () => {
        expect(mockCustomersRepository.create).toHaveBeenCalledWith({ body: { email: 'invalidCreate' } });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(new CommercetoolsError(mockCommercetoolsErrorMalformed));
      });
    });
  });

  describe('deleteById', () => {
    let response: Customer;

    describe('when success', () => {
      let expectedResponse;

      beforeEach(async () => {
        expectedResponse = mockCommercetoolsCustomerResponse;
        response = await service.deleteById('id', 1);
      });

      it('should call CustomersRepository.deleteById', () => {
        expect(mockCustomersRepository.deleteById).toHaveBeenCalledWith('id', {
          queryArgs: {
            version: 1
          }
        });
      });

      it('should return deleted customer', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
