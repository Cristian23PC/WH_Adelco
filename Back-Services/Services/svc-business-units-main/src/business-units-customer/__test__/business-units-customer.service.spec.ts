const mockCustomersService = {
  getCustomerByEmail: jest.fn((email: string) => {
    if (email.indexOf('not-found@mail.com') >= 0) {
      return Promise.reject(new HttpException('Customer not found', HttpStatus.NOT_FOUND));
    }
    if (email.indexOf('invalidSearch') >= 0) {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorMalformed));
    }
    if (email.indexOf('no-units@mail.com') >= 0) {
      return Promise.resolve(mockCommercetoolsCustomerNoUnitsResponse);
    }
    if (email.indexOf('error-units@mail.com') >= 0) {
      return Promise.resolve(mockCommercetoolsCustomerErrorResponse);
    }
    return Promise.resolve(mockCommercetoolsCustomerResponse);
  })
};

jest.mock('@/customers/customers.service', () => ({
  CustomersService: jest.fn().mockImplementation(() => mockCustomersService)
}));

const mockBusinessUnitsService = {
  findBusinessUnits: jest.fn((customerId: string) => {
    if (customerId.indexOf('noUnitsId') >= 0) {
      return Promise.resolve({ businessUnits: [] });
    }
    if (customerId.indexOf('errorUnits') >= 0) {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorTimeout));
    }
    return Promise.resolve({
      businessUnits: [mockCompanyBusinessUnit, mockDivisionBusinessUnit]
    });
  })
};

jest.mock('@/business-units/business-units.service', () => ({
  BusinessUnitsService: jest.fn().mockImplementation(() => mockBusinessUnitsService)
}));

import { CommercetoolsError } from '@/nest-commercetools/errors';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from '@/customers/customers.service';
import { BusinessUnitsService } from '@/business-units/business-units.service';
import { BusinessUnitsCustomerService } from '../business-units-customer.service';
import { mockCommercetoolsCustomerResponse } from '@/customers/__mocks__/customers.mock';
import { ConvertedBusinessUnit } from '@/business-units/models';
import { mockCompanyBusinessUnit, mockDivisionBusinessUnit } from '@/business-units/__mocks__/business-units.mock';
import {
  mockCommercetoolsCustomerErrorResponse,
  mockCommercetoolsCustomerNoUnitsResponse,
  mockCommercetoolsErrorMalformed,
  mockCommercetoolsErrorTimeout
} from '@/business-units-users/__mocks__/business-units-users.mock';

describe('BusinessUnitsCustomerService', () => {
  let service: BusinessUnitsCustomerService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomersService, BusinessUnitsService, BusinessUnitsCustomerService]
    }).compile();

    service = module.get<BusinessUnitsCustomerService>(BusinessUnitsCustomerService);
  });

  describe('findBusinessUnitsForCustomer', () => {
    let response: HttpException | CommercetoolsError | { businessUnits: ConvertedBusinessUnit[] };

    describe('when success', () => {
      let expectedResponse;

      describe('when customers are found', () => {
        describe('when customer has business units', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: [mockCompanyBusinessUnit, mockDivisionBusinessUnit]
            };
            response = await service.findBusinessUnitsForCustomer('johndoe@mail.com');
          });

          it('should call CustomersService', () => {
            expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('johndoe@mail.com');
          });

          it('should call BusinessUnitsService', () => {
            expect(mockBusinessUnitsService.findBusinessUnits).toHaveBeenCalledWith('id');
          });

          it('should return Customer Business Units with results', () => {
            expect(response).toEqual(expectedResponse);
          });
        });

        describe('when customer does not have business units', () => {
          beforeEach(async () => {
            expectedResponse = {
              businessUnits: []
            };
            response = await service.findBusinessUnitsForCustomer('no-units@mail.com');
          });

          it('should call CustomersService', () => {
            expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('no-units@mail.com');
          });

          it('should call BusinessUnitsService', () => {
            expect(mockBusinessUnitsService.findBusinessUnits).toHaveBeenCalledWith('noUnitsId');
          });

          it('should return Customer Business Units with results', () => {
            expect(response).toEqual(expectedResponse);
          });
        });
      });

      describe('when no customers are found', () => {
        beforeEach(async () => {
          expectedResponse = new HttpException('Customer not found', HttpStatus.NOT_FOUND);
          try {
            await service.findBusinessUnitsForCustomer('not-found@mail.com');
          } catch (e) {
            response = e as HttpException;
          }
        });

        it('should call CustomerService', () => {
          expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('not-found@mail.com');
        });

        it('should not call BusinessUnitsService', () => {
          expect(mockBusinessUnitsService.findBusinessUnits).not.toHaveBeenCalled();
        });

        it('should return a 404 Error', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      let expectedResponse;

      describe('when querying for customer', () => {
        beforeEach(async () => {
          expectedResponse = new CommercetoolsError(mockCommercetoolsErrorMalformed);
          try {
            await service.findBusinessUnitsForCustomer('invalidSearch');
          } catch (e) {
            response = e as CommercetoolsError;
          }
        });

        it('should call CustomerService', () => {
          expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('invalidSearch');
        });

        it('should not call BusinessUnitsService', () => {
          expect(mockBusinessUnitsService.findBusinessUnits).not.toHaveBeenCalled();
        });

        it('should return an Error response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when querying for business units', () => {
        beforeEach(async () => {
          expectedResponse = new CommercetoolsError(mockCommercetoolsErrorTimeout);
          try {
            await service.findBusinessUnitsForCustomer('error-units@mail.com');
          } catch (e) {
            response = e as CommercetoolsError;
          }
        });

        it('should call CustomerService', () => {
          expect(mockCustomersService.getCustomerByEmail).toHaveBeenCalledWith('error-units@mail.com');
        });

        it('should call BusinessUnitsService', () => {
          expect(mockBusinessUnitsService.findBusinessUnits).toHaveBeenCalledWith('errorUnits');
        });

        it('should return an Error response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });
  });
});
