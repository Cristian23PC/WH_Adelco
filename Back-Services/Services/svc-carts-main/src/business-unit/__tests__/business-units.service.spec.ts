global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

const url = 'https://test.com/v1';

const mockBusinessUnitsRepository = {
  find: jest.fn((methodArgs: { queryArgs: { where: string[] } }) => {
    const where = methodArgs.queryArgs.where;
    if (where[0].indexOf('not-found') >= 0) {
      return Promise.resolve({ total: 0, results: [] });
    }
    return Promise.resolve({
      total: 1,
      results: [mockCompanyBusinessUnit]
    });
  })
};

const mockConfigService = {
  get: (key: string) => {
    if (key === 'businessUnits.baseUrl') return url;

    return key;
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

jest.mock('@/nest-commercetools/repositories/business-units', () => ({
  BusinessUnitsRepository: jest.fn().mockImplementation(() => mockBusinessUnitsRepository)
}));

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUnitsService } from '../business-units.service';
import { mockCompanyBusinessUnit } from '../__mocks__/business-units.mock';
import { ConvertedBusinessUnit, ICustomerBusinessUnits } from '../business-units.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ApiError } from '@/common/errors/api.error';
import { BusinessUnit } from '@commercetools/platform-sdk';
import { CommercetoolsError } from '@/nest-commercetools';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';

describe('BusinessUnitsService', () => {
  let service: BusinessUnitsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BusinessUnitsService, ConfigService, BusinessUnitsRepository]
    }).compile();

    service = module.get<BusinessUnitsService>(BusinessUnitsService);
  });

  describe('getBusinessUnitsForCustomer', () => {
    let response: NotFoundException | ICustomerBusinessUnits;

    describe('when success', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ businessUnits: [mockCompanyBusinessUnit] })
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        response = await service.getBusinessUnitsForCustomer('username@username.com');
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(`${url}/users/me/business-units`, {
          headers: { 'x-user-id': 'username@username.com' },
          method: 'GET',
          redirect: 'follow'
        });
      });

      it('should get business units', () => {
        expect(response).toEqual({ businessUnits: [mockCompanyBusinessUnit] });
      });
    });

    describe('when failure', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ statusCode: 404, message: 'Customer not found' })
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        try {
          await service.getBusinessUnitsForCustomer('notfound@notfound.com');
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(`${url}/users/me/business-units`, {
          headers: { 'x-user-id': 'notfound@notfound.com' },
          method: 'GET',
          redirect: 'follow'
        });
      });

      it('should return error NotFoundException', () => {
        expect(response).toEqual(new NotFoundException('Customer not found'));
      });
    });
  });

  describe('getBusinessUnitById', () => {
    let response: NotFoundException | ConvertedBusinessUnit | ApiError;

    describe('when success', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ ...mockCompanyBusinessUnit, id: 'bu-id' })
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        response = await service.getBusinessUnitById('bu-id');
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(`${url}/business-unit/bu-id`, {
          method: 'GET',
          redirect: 'follow'
        });
      });

      it('should get business unit', () => {
        expect(response).toEqual({ ...mockCompanyBusinessUnit, id: 'bu-id' });
      });
    });

    describe('when failure', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({ statusCode: 404, message: 'Business unit not found' })
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        try {
          await service.getBusinessUnitById('bu-fail');
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith(`${url}/business-unit/bu-fail`, {
          method: 'GET',
          redirect: 'follow'
        });
      });

      it('should return ApiError', () => {
        expect(response).toBeInstanceOf(ApiError);
      });

      it('should return the proper error', () => {
        expect((response as ApiError).code).toEqual('Carts-035');
      });

      it('should return the meta extra info', () => {
        expect((response as ApiError).meta).toEqual({
          id: 'bu-fail'
        });
      });
    });
  });

  describe('findBusinessUnitByIdAndCustomer', () => {
    let response: NotFoundException | ConvertedBusinessUnit | ApiError;

    describe('when success', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest
          .spyOn(service, 'getBusinessUnitsForCustomer')
          .mockImplementation(() =>
            Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' }] } as ICustomerBusinessUnits)
          );
        response = await service.findBusinessUnitByIdAndCustomer('bu-id', 'username@username.com');
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call service.getBusinessUnitsForCustomer', () => {
        expect(spy).toHaveBeenCalledWith('username@username.com');
      });

      it('should get business units', () => {
        expect(response).toEqual({ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' });
      });
    });

    describe('when Business unit not found', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest
          .spyOn(service, 'getBusinessUnitsForCustomer')
          .mockImplementation(() =>
            Promise.resolve({ businessUnits: [{ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' }] } as ICustomerBusinessUnits)
          );
        try {
          await service.findBusinessUnitByIdAndCustomer('no-bu-id', 'username@username.com');
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call service.getBusinessUnitsForCustomer', () => {
        expect(spy).toHaveBeenCalledWith('username@username.com');
      });

      it('should return ApiError', () => {
        expect(response).toBeInstanceOf(ApiError);
      });

      it('should return the proper error', () => {
        expect((response as ApiError).code).toEqual('Carts-035');
      });

      it('should return the meta extra info', () => {
        expect((response as ApiError).meta).toEqual({
          id: 'no-bu-id'
        });
      });
    });

    describe('when Business unit has no key', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest.spyOn(service, 'getBusinessUnitsForCustomer').mockImplementation(() => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { key, ...rest } = mockCompanyBusinessUnit;
          return Promise.resolve({ businessUnits: [{ ...rest, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' }] } as ICustomerBusinessUnits);
        });
        try {
          await service.findBusinessUnitByIdAndCustomer('bu-id', 'username@username.com');
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call service.getBusinessUnitsForCustomer', () => {
        expect(spy).toHaveBeenCalledWith('username@username.com');
      });

      it('should throw bad request exception', () => {
        expect(response).toEqual(new BadRequestException('Business unit has no key'));
      });
    });
  });

  describe('getAndValidateBusinessUnit', () => {
    let response: NotFoundException | ConvertedBusinessUnit;

    describe('when success with role CSR', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest
          .spyOn(service, 'getBusinessUnitById')
          .mockImplementation(() =>
            Promise.resolve({ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' } as ConvertedBusinessUnit)
          );
        response = await service.getAndValidateBusinessUnit('username@username.com', 'bu-id', ['CSR']);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call service.getBusinessUnitById', () => {
        expect(spy).toHaveBeenCalledWith('bu-id');
      });

      it('should get business units', () => {
        expect(response).toEqual({ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' });
      });
    });

    describe('when success without role', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest
          .spyOn(service, 'findBusinessUnitByIdAndCustomer')
          .mockImplementation(() =>
            Promise.resolve({ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' } as ConvertedBusinessUnit)
          );
        response = await service.getAndValidateBusinessUnit('username@username.com', 'bu-id');
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call service.findBusinessUnitByIdAndCustomer', () => {
        expect(spy).toHaveBeenCalledWith('bu-id', 'username@username.com');
      });

      it('should get business units', () => {
        expect(response).toEqual({ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key', distributionChannelId: 'dc-id' });
      });
    });

    describe('when Business unit missing delivery zone', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest
          .spyOn(service, 'findBusinessUnitByIdAndCustomer')
          .mockImplementation(() => Promise.resolve({ ...mockCompanyBusinessUnit, id: 'bu-id', distributionChannelId: 'dc-id' } as ConvertedBusinessUnit));
        try {
          await service.getAndValidateBusinessUnit('username@username.com', 'bu-id');
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call service.findBusinessUnitByIdAndCustomer', () => {
        expect(spy).toHaveBeenCalledWith('bu-id', 'username@username.com');
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('Business unit missing delivery zone'));
      });
    });

    describe('when Business unit missing distribution channel', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        spy = jest
          .spyOn(service, 'findBusinessUnitByIdAndCustomer')
          .mockImplementation(() => Promise.resolve({ ...mockCompanyBusinessUnit, id: 'bu-id', deliveryZoneKey: 'dz-key' } as ConvertedBusinessUnit));
        try {
          await service.getAndValidateBusinessUnit('username@username.com', 'bu-id');
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call service.findBusinessUnitByIdAndCustomer', () => {
        expect(spy).toHaveBeenCalledWith('bu-id', 'username@username.com');
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('Business unit missing distribution channel'));
      });
    });
  });

  describe('findByRut', () => {
    let response: BusinessUnit | CommercetoolsError;

    describe('when success', () => {
      describe('when customer business units are found', () => {
        beforeEach(async () => {
          response = await service.findByRut('rut');
        });

        it('should call BusinessUnitsRepository.find for rut', () => {
          expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: { where: [`custom(fields(rut="rut"))`], limit: 1, expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
          });
        });

        it('should return BusinessUnit', () => {
          expect(response).toEqual(mockCompanyBusinessUnit);
        });
      });
    });

    describe('when failure', () => {
      describe('when customer business units are not found', () => {
        beforeEach(async () => {
          response = await service.findByRut('not-found');
        });

        it('should call BusinessUnitsRepository.find for rut', () => {
          expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: { where: [`custom(fields(rut="not-found"))`], limit: 1, expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
          });
        });

        it('should return undefined', () => {
          expect(response).toBeUndefined();
        });
      });
    });
  });

  describe('findBusinessUnitByAssociateId', () => {
    let response: BusinessUnit | CommercetoolsError;

    describe('when success', () => {
      describe('when customer business units are found', () => {
        beforeEach(async () => {
          response = await service.findBusinessUnitByAssociateId('customerId');
        });

        it('should call BusinessUnitsRepository.find for rut', () => {
          expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: { where: [`associates(customer(id="customerId"))`], limit: 1, expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
          });
        });

        it('should return BusinessUnit', () => {
          expect(response).toEqual(mockCompanyBusinessUnit);
        });
      });

      describe('when customer business units are not found', () => {
        beforeEach(async () => {
          response = await service.findBusinessUnitByAssociateId('not-found');
        });

        it('should call BusinessUnitsRepository.find for rut', () => {
          expect(mockBusinessUnitsRepository.find).toHaveBeenNthCalledWith(1, {
            queryArgs: { where: [`associates(customer(id="not-found"))`], limit: 1, expand: ['associates[*].customer', 'custom.fields.deliveryZone'] }
          });
        });

        it('should return undefined', () => {
          expect(response).toEqual(undefined);
        });
      });
    });
  });

  describe('repRegistration', () => {
    let response: NotFoundException | ConvertedBusinessUnit;
    const body = {
      username: 'username',
      rut: 'rut',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone',
      tradeName: 'tradeName',
      address: {
        country: 'CL',
        region: 'rEGION',
        commune: 'Commune',
        city: 'City',
        streetName: 'StreetName'
      },
      isFakeCustomer: true
    };
    describe('when succeeds', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => mockCompanyBusinessUnit
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        response = await service.repRegistration(body, true);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith('https://test.com/v1/users/rep-registration', {
          body: JSON.stringify({
            username: 'username',
            rut: 'rut',
            firstName: 'firstName',
            lastName: 'lastName',
            phone: 'phone',
            tradeName: 'tradeName',
            address: { country: 'CL', region: 'rEGION', commune: 'Commune', city: 'City', streetName: 'StreetName' },
            isFakeCustomer: true
          }),
          headers: { 'Content-Type': 'application/json', 'x-user-roles': '["__INTERNAL__"]' },
          method: 'POST',
          redirect: 'follow'
        });
      });

      it('should get an active cart', () => {
        expect(response).toEqual(mockCompanyBusinessUnit);
      });
    });

    describe('when failure', () => {
      let fetchMock: any = undefined;

      beforeEach(async () => {
        const assetsFetchMock = () =>
          Promise.resolve({
            ok: true,
            status: 200,
            json: async () => ({
              statusCode: 400,
              message: 'Error.'
            })
          } as Response);
        fetchMock = jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
        try {
          response = await service.repRegistration(body, true);
        } catch (error) {
          response = error;
        }
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('should call fetch mock', () => {
        expect(fetchMock).toHaveBeenCalledWith('https://test.com/v1/users/rep-registration', {
          body: JSON.stringify({
            username: 'username',
            rut: 'rut',
            firstName: 'firstName',
            lastName: 'lastName',
            phone: 'phone',
            tradeName: 'tradeName',
            address: { country: 'CL', region: 'rEGION', commune: 'Commune', city: 'City', streetName: 'StreetName' },
            isFakeCustomer: true
          }),
          headers: { 'Content-Type': 'application/json', 'x-user-roles': '["__INTERNAL__"]' },
          method: 'POST',
          redirect: 'follow'
        });
      });

      it('should return error NotFoundException', () => {
        expect(response).toEqual(new Error('Error.'));
      });
    });
  });
});
