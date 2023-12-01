const mockBusinessUnitsCustomerService = {
  findBusinessUnitsForCustomer: jest.fn().mockImplementation(email => {
    if (email === 'johndoe@mail.com') {
      return { businessUnits: [{ id: 'id' }, { id: 'otherId' }] };
    }
    return { businessUnits: [] };
  })
};

jest.mock('../business-units-customer.service', () => ({
  BusinessUnitsCustomerService: jest.fn().mockImplementation(() => mockBusinessUnitsCustomerService)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'customerBusinessUnits.customerHeaderKey':
        return 'x-user-id';
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { BusinessUnitsCustomerController } from '../business-units-customer.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUnitsCustomerService } from '../business-units-customer.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { ConvertedBusinessUnit } from '@/business-units/models';

describe('BusinessUnitsCustomerController', () => {
  let controller: BusinessUnitsCustomerController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitsCustomerController],
      providers: [BusinessUnitsCustomerService, ConfigService]
    }).compile();

    controller = module.get<BusinessUnitsCustomerController>(BusinessUnitsCustomerController);
  });

  describe('getBusinessUnitsForCustomer', () => {
    let response: { businessUnits: ConvertedBusinessUnit[] } | BadRequestException;

    describe('when requesting business units', () => {
      describe('when correct header is provided', () => {
        beforeEach(async () => {
          response = await controller.getBusinessUnitsForCustomer({ 'x-user-id': 'johndoe@mail.com' });
        });

        it('should call BusinessUnitsCustomersService', () => {
          expect(mockBusinessUnitsCustomerService.findBusinessUnitsForCustomer).toHaveBeenCalledWith('johndoe@mail.com');
        });

        it('should return expected response with regions', () => {
          expect(response).toEqual({ businessUnits: [{ id: 'id' }, { id: 'otherId' }] });
        });
      });

      describe('when a header is not provided', () => {
        beforeEach(async () => {
          try {
            await controller.getBusinessUnitsForCustomer({ customer: 'johndoe@mail.com' });
          } catch (e) {
            response = e as BadRequestException;
          }
        });

        it('should call BusinessUnitsCustomersService', () => {
          expect(mockBusinessUnitsCustomerService.findBusinessUnitsForCustomer).not.toHaveBeenCalled();
        });

        it('should throw an error', () => {
          expect(response).toEqual(new BadRequestException('Customer ID missing'));
        });
      });
    });
  });
});
