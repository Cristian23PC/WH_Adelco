const mockOrdersRepository = {
  create: jest.fn(({ body }: { body: OrderFromCartDraft }) => {
    switch (body.orderNumber) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The CustomObject with ID '(container,error)' was not found.",
            errors: [
              {
                code: 'InvalidSubject',
                message: "The CustomObject with ID '(container,error)' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve(mockOrderResponse);
    }
  }),
  getById: jest.fn((ID: string) => {
    switch (ID) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The Resource with ID 'error' was not found.",
            errors: [
              {
                code: 'ResourceNotFound',
                message: "The Resource with ID 'error' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve({ ...mockOrderResponse, paymentInfo: { payments: [{ typeId: 'payment', id: mockPaymentResponse.id, obj: mockPaymentResponse }] } });
    }
  }),
  updateById: jest.fn((ID: string) => {
    switch (ID) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The Resource with ID 'error' was not found.",
            errors: [
              {
                code: 'ResourceNotFound',
                message: "The Resource with ID 'error' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve(mockOrderResponse);
    }
  })
};

const mockPaymentsRepository = {
  updateById: jest.fn((id: string) => {
    switch (id) {
      case 'error':
        return Promise.reject(
          new CommercetoolsError({
            statusCode: 404,
            message: "The CustomObject with ID '(container,error)' was not found.",
            errors: [
              {
                code: 'InvalidSubject',
                message: "The CustomObject with ID '(container,error)' was not found."
              }
            ]
          })
        );
      default:
        return Promise.resolve(mockPaymentResponse);
    }
  })
};

const mockConfigService = {
  get: (key: string) => key
};

const mockNotificationsService = {
  sendNotification: jest.fn().mockImplementation(() => Promise.resolve())
};

jest.mock('@/notifications', () => ({
  NotificationsService: jest.fn().mockImplementation(() => mockNotificationsService)
}));

const mockStatesRepository = {
  getByKey: jest.fn()
};

const mockCache = {
  get: jest.fn(() => Promise.resolve()),
  set: jest.fn(() => Promise.resolve())
};

const mockCustomObjectsRepository = {
  create: jest.fn(),
  getByContainerAndKey: jest.fn()
};

import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { CommercetoolsExceptionFilter } from '@/common/filters/commercetools.exception.filter';
import { ApiErrorFilter } from '@/common/filters/api.exception.filter';
import { mockAdelcoOrder, mockOrderResponse, mockUpdatePaymentRequest, mockupdateDeliveriesRequest } from '../__mocks__/orders.mock';
import { OrdersService } from '../orders.service';
import { CustomObjectsRepository, OrdersRepository, PaymentsRepository, StatesRepository } from 'commercetools-sdk-repositories';
import { CommercetoolsError } from '@/nest-commercetools';
import { OrderFromCartDraft } from '@commercetools/platform-sdk';
import { PaymentsService } from '@/payments/payments.service';
import { mockPaymentResponse } from '@/payments/__mocks__/payments.mocks';
import { ConfigService } from '@nestjs/config';
import { Roles } from '@/common/enum/roles.enum';
import { NotificationsService } from '@/notifications';
import { OrdersHelperService } from '@/orders-helper/orders-helper.service';
import { StatesService } from '@/state/states.service';
import { SequenceService } from '@/sequence/sequence.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreditNotesService } from '@/credit-notes/credit-notes.service';

describe('orders', () => {
  const url = '/orders';
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        OrdersHelperService,
        StatesService,
        SequenceService,
        PaymentsService,
        NotificationsService,
        CreditNotesService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCache
        },
        {
          provide: PaymentsRepository,
          useValue: mockPaymentsRepository
        },
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        },
        {
          provide: StatesRepository,
          useValue: mockStatesRepository
        },
        {
          provide: CustomObjectsRepository,
          useValue: mockCustomObjectsRepository
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter()).useGlobalFilters(new CommercetoolsExceptionFilter()).useGlobalFilters(new ApiErrorFilter());

    await app.init();
  });

  describe('PATCH /:orderId/update-payment', () => {
    describe('when succeeds', () => {
      const xUserId = 'username@username.com';
      const xUserRoles = JSON.stringify([Roles.Internal]);
      const orderId = 'orderId';

      it('should update the payment, update the order state and return AdelcoOrder', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-payment`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRoles)
          .send(mockUpdatePaymentRequest)
          .expect(200)
          .expect(mockAdelcoOrder);
      });
    });

    describe('when not send x-user-id', () => {
      const xUserRoles = JSON.stringify([Roles.Internal]);
      const orderId = 'orderId';

      it('should throw 400 when user id missing', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-payment`)
          .set('x-user-roles', xUserRoles)
          .send(mockUpdatePaymentRequest)
          .expect(400)
          .expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when not send x-user-roles', () => {
      const xUserId = 'username@username.com';
      const orderId = 'orderId';

      it('should throw 400 when user roles missing', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-payment`)
          .set('x-user-id', xUserId)
          .send(mockUpdatePaymentRequest)
          .expect(400)
          .expect({ statusCode: 400, message: 'User Roles missing' });
      });
    });

    describe('when send x-user-roles different to INTERNAL', () => {
      const xUserId = 'username@username.com';
      const xUserRoles = JSON.stringify(['no-valid']);
      const orderId = 'orderId';

      it('should throw 403 with insufficient permissions', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-payment`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRoles)
          .send(mockUpdatePaymentRequest)
          .expect(403)
          .expect({ statusCode: 403, message: 'Insufficient permissions' });
      });
    });

    describe('when the paymentId send not exist in the order', () => {
      const xUserId = 'username@username.com';
      const xUserRoles = JSON.stringify([Roles.Internal]);
      const orderId = 'orderId';

      it('should update the payment, update the order state and return AdelcoOrder', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-payment`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRoles)
          .send({ ...mockUpdatePaymentRequest, paymentId: 'no-exist' })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Payment not associated to the order',
            code: 'Orders-036'
          });
      });
    });
  });

  describe('PATCH /:orderId/update-deliveries', () => {
    describe('when succeeds', () => {
      const xUserId = 'username@username.com';
      const xUserRoles = JSON.stringify([Roles.Internal]);
      const orderId = 'orderId';

      it('should update the deliveries, add transaction in the payment and return AdelcoOrder', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-deliveries`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRoles)
          .send(mockupdateDeliveriesRequest)
          .expect(200)
          .expect(mockAdelcoOrder);
      });
    });

    describe('when not send x-user-id', () => {
      const xUserRoles = JSON.stringify([Roles.Internal]);
      const orderId = 'orderId';

      it('should throw 400 when user id missing', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-deliveries`)
          .set('x-user-roles', xUserRoles)
          .send(mockupdateDeliveriesRequest)
          .expect(400)
          .expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when not send x-user-roles', () => {
      const xUserId = 'username@username.com';
      const orderId = 'orderId';

      it('should throw 400 when user roles missing', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-deliveries`)
          .set('x-user-id', xUserId)
          .send(mockupdateDeliveriesRequest)
          .expect(400)
          .expect({ statusCode: 400, message: 'User Roles missing' });
      });
    });

    describe('when send x-user-roles different to INTERNAL', () => {
      const xUserId = 'username@username.com';
      const xUserRoles = JSON.stringify(['no-valid']);
      const orderId = 'orderId';

      it('should throw 403 with insufficient permissions', () => {
        return request(app.getHttpServer())
          .patch(`${url}/${orderId}/update-deliveries`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', xUserRoles)
          .send(mockupdateDeliveriesRequest)
          .expect(403)
          .expect({ statusCode: 403, message: 'Insufficient permissions' });
      });
    });
  });
});
