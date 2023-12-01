const mockOrdersService = {
  updatePayment: jest.fn().mockImplementation(() => {
    return mockAdelcoOrder;
  }),
  updateDeliveries: jest.fn().mockImplementation(() => {
    return mockAdelcoOrder;
  }),
  collectPayments: jest.fn()
};

jest.mock('../orders.service', () => ({
  OrdersService: jest.fn().mockImplementation(() => mockOrdersService)
}));

const mockConfigService = {
  get: (key: string) => {
    if (key === 'orders.userHeaderId') {
      return userHeaderId;
    }

    return key;
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { mockAdelcoOrder, mockUpdatePaymentRequest, mockupdateDeliveriesRequest } from '@/orders/__mocks__/orders.mock';
import { AdelcoOrder } from '@adelco/price-calc';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { CollectPaymentsDtoRequest } from '../dto/collect-payments.dto';
import { userHeaderId } from '@/common/constants/headers';

describe('OrdersController', () => {
  let controller: OrdersController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [OrdersService, ConfigService]
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  describe('updatePayment', () => {
    let response: AdelcoOrder | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.updatePayment({ 'x-user-id': 'truckDriverId' }, 'orderId', mockUpdatePaymentRequest);
      });

      it('should call OrdersService.updatePayment', () => {
        expect(mockOrdersService.updatePayment).toHaveBeenCalledWith(
          'orderId',
          {
            accountNumber: 'accountNumber',
            amountPaid: 123123,
            bankCode: 'bankCode',
            businessUnitId: 'businessunitid',
            checkExpirationDate: '2023-08-28T00:00:00Z',
            checkNumber: 'checkNumber',
            condition: 'Cash',
            deliveryId: 'deliveryId',
            documentId: 'dteNumber',
            extraInfo: 'extra info',
            method: 'Cash',
            paymentId: '85f70fc1-47fc-4bd5-bf29-48daf2387625',
            status: 'Paid',
            transferNumber: 'transferNumber',
            trxNumber: 'trxNumber'
          },
          'truckDriverId'
        );
      });

      it('should return AdelcoOrder response', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });
  });

  describe('updateDeliveries', () => {
    let response: AdelcoOrder | BadRequestException;

    describe('when correct header is provided', () => {
      beforeEach(async () => {
        response = await controller.updateDeliveries('orderId', mockupdateDeliveriesRequest);
      });

      it('should call OrdersService.updateDeliveries', () => {
        expect(mockOrdersService.updateDeliveries).toHaveBeenCalledWith('orderId', mockupdateDeliveriesRequest);
      });

      it('should return AdelcoOrder response', () => {
        expect(response).toEqual(mockAdelcoOrder);
      });
    });
  });

  describe('collectPayments', () => {
    const collectPaymentsDto: CollectPaymentsDtoRequest = {} as CollectPaymentsDtoRequest;
    const expectedResult = {
      orders: [],
      payments: [],
      creditNotes: []
    };
    let result;
    beforeEach(async () => {
      mockOrdersService.collectPayments.mockResolvedValue(expectedResult);
      result = await controller.collectPayments({ 'x-user-id': 'salesRepId' }, collectPaymentsDto);
    });

    it('should call OrdersService.collectPayments', async () => {
      expect(mockOrdersService.collectPayments).toHaveBeenCalledWith(collectPaymentsDto, 'salesRepId');
    });

    it('should return correct value', async () => {
      expect(result).toEqual(expectedResult);
    });
  });
});
