const mockBusinessUnitOrdersService = {
  convertActiveCart: jest.fn().mockImplementation(() => {
    return mockAdelcoOrder;
  })
};

jest.mock('../business-unit-orders.service', () => ({
  BusinessUnitOrdersService: jest.fn().mockImplementation(() => mockBusinessUnitOrdersService)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'business-unit-orders.userHeaderId':
        return userHeaderId;
      case 'business-unit-orders.userHeaderRoles':
        return userHeaderRoles;
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { mockAdelcoOrder } from '@/orders/__mocks__/orders.mock';
import { BusinessUnitOrdersController } from '../business-unit-orders.controller';
import { BusinessUnitOrdersService } from '../business-unit-orders.service';
import { ORDER_SOURCE } from '../enum/business-unit-orders.enum';
import { PAYMENT_METHOD } from '@/payments/enum/payment.enum';
import { AdelcoOrder } from '@adelco/price-calc';

describe('BusinessUnitOrdersController', () => {
  let controller: BusinessUnitOrdersController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitOrdersController],
      providers: [BusinessUnitOrdersService, ConfigService]
    }).compile();

    controller = module.get<BusinessUnitOrdersController>(BusinessUnitOrdersController);
  });

  describe('convertActiveCart', () => {
    let response: AdelcoOrder | BadRequestException;
    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.convertActiveCart({ 'x-user-id': 'username@username.com', 'x-user-roles': '["CSR"]' }, 'business-unit-id', {
          paymentMethod: PAYMENT_METHOD.CASH,
          source: ORDER_SOURCE.ECOMMERCE
        });
      });

      it('should call BusinessUnitOrdersService.convertActiveCart', () => {
        expect(mockBusinessUnitOrdersService.convertActiveCart).toHaveBeenCalledWith(
          {
            body: { paymentMethod: 'Cash', source: 'ecomm' },
            businessUnitId: 'business-unit-id',
            roles: ['CSR'],
            username: 'username@username.com'
          },
          undefined
        );
      });

      it('should return AdelcoOrder response', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });

    describe('when a header["x-user-id"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.convertActiveCart({ 'x-user-roles': '["CSR"]' }, 'business-unit-id', {
            paymentMethod: PAYMENT_METHOD.CASH,
            source: ORDER_SOURCE.ECOMMERCE
          });
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitOrdersService.convertActiveCart', () => {
        expect(mockBusinessUnitOrdersService.convertActiveCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User ID missing'));
      });
    });

    describe('when a header["x-user-roles"] is not provided', () => {
      beforeEach(async () => {
        try {
          await controller.convertActiveCart({ 'x-user-id': 'username@username.com' }, 'business-unit-id', {
            paymentMethod: PAYMENT_METHOD.CASH,
            source: ORDER_SOURCE.ECOMMERCE
          });
        } catch (e) {
          response = e as BadRequestException;
        }
      });

      it('should not call BusinessUnitOrdersService.convertActiveCart', () => {
        expect(mockBusinessUnitOrdersService.convertActiveCart).not.toHaveBeenCalled();
      });

      it('should throw an Error', () => {
        expect(response).toEqual(new BadRequestException('User Roles missing'));
      });
    });

    describe('when forceUpdate param is provided', () => {
      const forceUpdate = true;

      beforeEach(async () => {
        response = await controller.convertActiveCart(
          { 'x-user-id': 'username@username.com', 'x-user-roles': '["CSR"]' },
          'business-unit-id',
          {
            paymentMethod: PAYMENT_METHOD.CASH,
            source: ORDER_SOURCE.ECOMMERCE
          },
          { forceUpdate }
        );
      });

      it('should call BusinessUnitOrdersService.convertActiveCart', () => {
        expect(mockBusinessUnitOrdersService.convertActiveCart).toHaveBeenCalledWith(
          {
            body: { paymentMethod: 'Cash', source: 'ecomm' },
            businessUnitId: 'business-unit-id',
            roles: ['CSR'],
            username: 'username@username.com'
          },
          forceUpdate
        );
      });

      it('should return AdelcoOrder response', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });
  });
});
