const mockBusinessUnitsService = {
  update: jest.fn().mockImplementation(() => {
    return mockCompanyBusinessUnit;
  }),
  getConvertedById: jest.fn().mockImplementation(() => {
    return mockCompanyBusinessUnit;
  }),
  findConvertedByRut: jest.fn().mockImplementation(() => ({
    id: 'id'
  })),
  createDivision: jest.fn().mockImplementation(() => ({
    id: 'id'
  })),
  getAllBusinessUnits: jest.fn().mockImplementation(() => {
    return mockBusinessUnitList;
  })
};

jest.mock('../business-units.service', () => ({
  BusinessUnitsService: jest.fn().mockImplementation(() => mockBusinessUnitsService)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'businessUnits.userHeaderId':
        return userHeaderId;
      case 'businessUnits.userHeaderRoles':
        return userHeaderRoles;
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

const mockPaymentMethods = [{ key: 'cash' }, { key: 'bank-transfer' }];

const mockPaymentsMethodsService = {
  getEnabledPaymentMethods: jest.fn().mockImplementation(() => mockPaymentMethods)
};

jest.mock('@/payments-methods/payment-methods.service', () => ({
  PaymentsMethodsService: jest.fn().mockImplementation(() => mockPaymentsMethodsService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { BusinessUnitsController } from '../business-units.controller';
import { BusinessUnitsService } from '../business-units.service';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { filterGetAllBusinessUnitsMock, mockBusinessUnitList, mockCompanyBusinessUnit, requestBusinessUnitMock } from '../__mocks__/business-units.mock';
import { ConvertedBusinessUnit } from '../models';
import { CreateDivisionRequestDto } from '../dto/division.dto';
import { THeaders } from '@/common/types';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';

describe('BusinessUnitsController', () => {
  let controller: BusinessUnitsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitsController],
      providers: [BusinessUnitsService, PaymentsMethodsService, ConfigService]
    }).compile();

    controller = module.get<BusinessUnitsController>(BusinessUnitsController);
  });

  describe('update', () => {
    let response: ConvertedBusinessUnit | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.update({ 'x-user-id': 'johndoe@mail.com' }, 'id', requestBusinessUnitMock);
      });

      it('should call BusinessUnitService', () => {
        expect(mockBusinessUnitsService.update).toHaveBeenCalledWith('id', requestBusinessUnitMock, 'johndoe@mail.com');
      });

      it('should return expected response with business unit updated', () => {
        expect(response).toEqual(mockCompanyBusinessUnit);
      });
    });

    describe('when a header is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.update({}, 'id', requestBusinessUnitMock);
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitService', () => {
        expect(mockBusinessUnitsService.update).not.toHaveBeenCalled();
      });

      it('should throw an error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });
  });

  describe('getById', () => {
    let response: ConvertedBusinessUnit | BadRequestException;

    describe('when ID is provided', () => {
      beforeEach(async () => {
        response = await controller.getById('id');
      });

      it('should call BusinessUnitService', () => {
        expect(mockBusinessUnitsService.getConvertedById).toHaveBeenCalledWith('id');
      });

      it('should return expected response with business unit', () => {
        expect(response).toEqual(mockCompanyBusinessUnit);
      });
    });
  });

  describe('byRut', () => {
    let response: ConvertedBusinessUnit[] | BadRequestException | ForbiddenException;

    describe('when the headers are ok', () => {
      const headers = { 'x-user-roles': ['__INTERNAL__'] };
      const rut = 'rut1';

      beforeEach(async () => {
        response = await controller.byRut(headers, rut);
      });

      it('should call findConvertedByRut service method', () => {
        expect(mockBusinessUnitsService.findConvertedByRut).toHaveBeenCalledWith(rut);
      });

      it('should return expected response bu', () => {
        expect(response).toEqual({
          id: 'id'
        });
      });
    });

    describe('when request with the missing headers', () => {
      const headers = {};
      const rut = 'rut1';

      beforeEach(async () => {
        try {
          await controller.byRut(headers, rut);
        } catch (error) {
          response = error;
        }
      });

      it('should not call findConvertedByRut', () => {
        expect(mockBusinessUnitsService.findConvertedByRut).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('User roles missing'));
      });
    });

    describe('when request with wrong role', () => {
      const headers = { 'x-user-roles': ['other'] };
      const rut = 'rut1';

      beforeEach(async () => {
        try {
          await controller.byRut(headers, rut);
        } catch (error) {
          response = error;
        }
      });

      it('should not call findConvertedByRut', () => {
        expect(mockBusinessUnitsService.findConvertedByRut).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new ForbiddenException('Insufficient permissions'));
      });
    });
  });

  describe('createDivision', () => {
    let response: ConvertedBusinessUnit | BadRequestException;

    describe('when correct headers are provided', () => {
      const body = {} as CreateDivisionRequestDto;
      const headers: THeaders = { [userHeaderId]: 'username', [userHeaderRoles]: ['role1', 'role2'] };
      const parentBusinessUnitId = 'parentId';

      beforeEach(async () => {
        response = await controller.createDivision(headers, parentBusinessUnitId, body);
      });

      it('should call createDivision service method', () => {
        expect(mockBusinessUnitsService.createDivision).toHaveBeenCalledWith('parentId', body, { username: 'username', userRoles: ['role1', 'role2'] });
      });

      it('should return expected response with new division', () => {
        expect(response).toEqual({
          id: 'id'
        });
      });
    });

    describe('when request user id is missing', () => {
      const headers = {};
      const parentBusinessUnitId = 'parentId';
      const body = {} as CreateDivisionRequestDto;

      beforeEach(async () => {
        try {
          await controller.createDivision(headers, parentBusinessUnitId, body);
        } catch (error) {
          response = error;
        }
      });

      it('should not call createDivision service method', () => {
        expect(mockBusinessUnitsService.createDivision).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('Customer ID missing'));
      });
    });

    describe('when request user roles are missing', () => {
      const headers = { [userHeaderId]: 'username' };
      const parentBusinessUnitId = 'parentId';
      const body = {} as CreateDivisionRequestDto;

      beforeEach(async () => {
        try {
          await controller.createDivision(headers, parentBusinessUnitId, body);
        } catch (error) {
          response = error;
        }
      });

      it('should not call createDivision service method', () => {
        expect(mockBusinessUnitsService.createDivision).not.toHaveBeenCalled();
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('User roles missing'));
      });
    });
  });

  describe('getEnabledPaymentMethods', () => {
    it('should call getEnabledPaymentMethods with the correct params', async () => {
      const headers = { 'x-user-id': 'johndoe@mail.com' };
      const buId = '1';
      await controller.getEnabledPaymentMethods(headers, buId);
      expect(mockPaymentsMethodsService.getEnabledPaymentMethods).toHaveBeenCalledWith(buId);
    });

    it('should throw BadRequestException if header is not provided', async () => {
      const headers = {};
      const buId = '1';
      await expect(controller.getEnabledPaymentMethods(headers, buId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllBusinessUnit', () => {
    it('get all Business Unit - success', async () => {
      expect(await controller.getAllBusinessUnits(filterGetAllBusinessUnitsMock)).toEqual(mockBusinessUnitList);
    });
  });
});
