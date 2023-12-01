global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

const mockCartsRepository = {
  updateById: jest.fn(() => {
    return Promise.resolve(mockCartResponse);
  })
};

const mockCustomObjectsRepository = {
  getByContainerAndKey: jest.fn(() => {
    return Promise.resolve(mockSequenceResponse);
  }),
  find: jest.fn(() => {
    return Promise.resolve({
      results: [mockPaymentMethodsResponse]
    });
  }),
  create: jest.fn(() => {
    return Promise.resolve(mockNewSequenceResponse);
  })
};

const mockPaymentsRepository = {
  create: jest.fn(() => {
    return Promise.resolve(mockPaymentResponse);
  })
};

const mockOrdersRepository = {
  create: jest.fn(() => {
    return Promise.resolve(mockOrderResponse);
  })
};

const mockStatesRepository = {
  getByKey: jest.fn(() => {
    return Promise.resolve(mockStateResponse);
  })
};

const mockBusinessUnitRepository = {
  getByKey: jest.fn(() => mockCompanyBusinessUnit)
};

const mockCache = {
  get: jest.fn(key => {
    if (key === `STATE_${KEY_ORDER_STATE.OPEN}` || key === 'STATE_error') {
      return Promise.resolve();
    }

    return Promise.resolve(mockStateResponse);
  }),
  set: jest.fn(() => Promise.resolve())
};

const baseUrl = 'https://test.com/v1';

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'business-unit-orders.userHeaderId':
        return userHeaderId;
      case 'business-unit-orders.userHeaderRoles':
        return userHeaderRoles;
      case 'custom-object-sequence.sequenceContainer':
        return 'sequence';
      case 'custom-object-sequence.orderNumberKey':
        return 'orderNumber';
      case 'svc-carts.baseUrl':
        return baseUrl;
      default:
        return key;
    }
  }
};

jest.mock('@adelco/lib_delivery', () => ({
  getNextDeliveryDates: jest.fn().mockImplementation(() => mockGetNextDeliveryDates)
}));

const mockNotificationsService = {
  sendNotification: jest.fn().mockImplementation(() => Promise.resolve())
};

jest.mock('@/notifications', () => ({
  NotificationsService: jest.fn().mockImplementation(() => mockNotificationsService)
}));

import request from 'supertest';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BusinessUnitOrdersController } from '../business-unit-orders.controller';
import { BusinessUnitOrdersService } from '../business-unit-orders.service';
import { SvcCartsService } from '@/svc-carts/svc-carts.service';
import { OrdersHelperService } from '@/orders-helper/orders-helper.service';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '@/orders/orders.service';
import { PaymentsHelperService } from '@/payments-helper/payments-helper.service';
import { PaymentsService } from '@/payments/payments.service';
import { SequenceService } from '@/sequence/sequence.service';
import { CartsRepository, CustomObjectsRepository, OrdersRepository, PaymentsRepository, StatesRepository } from 'commercetools-sdk-repositories';
import { mockAdelcoOrder, mockAdelcoOrderWithCartUpdatesOrder, mockOrderResponse } from '@/orders/__mocks__/orders.mock';
import { mockPaymentResponse } from '@/payments/__mocks__/payments.mocks';
import { mockNewSequenceResponse, mockSequenceResponse } from '@/sequence/__mocks__/sequence.mocks';
import { mockGetActiveCart, mockGetActiveWithCartUpdatesCart, mockGetNextDeliveryDates } from '@/svc-carts/__mocks__/svc-carts.mock';
import { userHeaderId, userHeaderRoles } from '@/common/constants/headers';
import { ApiErrorFilter } from '@/common/filters/api.exception.filter';
import { CommercetoolsExceptionFilter } from '@/common/filters/commercetools.exception.filter';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { CartsService } from '@/carts/carts.service';
import { mockCartResponse } from '@/carts/__mocks__/carts.mock';
import { StatesService } from '@/state/states.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { KEY_ORDER_STATE } from '@/orders/orders.interface';
import { mockStateResponse } from '@/state/__mocks__/states.mock';
import { SvcBusinessUnitsService } from '@/svc-business-units/svc-business-units.service';
import { mockGetById } from '@/svc-business-units/__mocks__/svc-business-units.mock';
import { NotificationsService } from '@/notifications';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { mockCompanyBusinessUnit } from '@/business-unit/__mocks__/business-unit';
import { TrimStringsPipe } from '@/common/transformer/trim-strings.pipe';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';
import { mockPaymentMethodsResponse } from '@/payments-methods/__mocks__/payment-methods.mock';
import { CreditNotesService } from '@/credit-notes/credit-notes.service';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';

const mockSvcBusinessUnitsService = {
  getById: jest.fn(() => Promise.resolve(mockGetById))
};

describe('business-unit', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessUnitOrdersController],
      providers: [
        BusinessUnitOrdersService,
        SvcCartsService,
        OrdersHelperService,
        OrdersService,
        PaymentsHelperService,
        PaymentsService,
        SequenceService,
        CartsService,
        StatesService,
        NotificationsService,
        DeliveryZonesService,
        PaymentsMethodsService,
        CreditNotesService,
        {
          provide: CACHE_MANAGER,
          useValue: mockCache
        },
        {
          provide: StatesRepository,
          useValue: mockStatesRepository
        },
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository
        },
        {
          provide: BusinessUnitsRepository,
          useValue: mockBusinessUnitRepository
        },
        {
          provide: PaymentsRepository,
          useValue: mockPaymentsRepository
        },
        {
          provide: SvcBusinessUnitsService,
          useValue: mockSvcBusinessUnitsService
        },
        {
          provide: CustomObjectsRepository,
          useValue: mockCustomObjectsRepository
        },
        {
          provide: CartsRepository,
          useValue: mockCartsRepository
        },
        {
          provide: ConfigService,
          useValue: mockConfigService
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app
      .useGlobalFilters(new AllExceptionsFilter())
      .useGlobalFilters(new CommercetoolsExceptionFilter())
      .useGlobalFilters(new ApiErrorFilter())
      .useGlobalPipes(new TrimStringsPipe(), new ValidationPipe({ transform: true, whitelist: true }));

    await app.init();
  });

  describe('POST /:businessUnitId/orders/convert-active-cart', () => {
    const url = '/business-unit';

    beforeEach(() => {
      const assetsFetchMock = (url: string) => {
        if (url === `${baseUrl}/business-unit/business-unit-id-cart-no-stock/carts/active?forceUpdate=false`) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => mockGetActiveWithCartUpdatesCart
          } as Response);
        }

        if (url === `${baseUrl}/business-unit/business-unit-id-cart-no-stock/carts/active?forceUpdate=true`) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => mockGetActiveWithCartUpdatesCart
          } as Response);
        }

        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockGetActiveCart
        } as Response);
      };
      jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
    });

    describe('when success', () => {
      const xUserId = 'username@username.com';
      const businessUnitId = 'business-unit-id';

      it('should convert the cart to Order and return Adelco Order', () => {
        return request(app.getHttpServer())
          .post(`${url}/${businessUnitId}/orders/convert-active-cart`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', '[]')
          .send({ paymentMethod: 'Cash', source: 'ecomm' })
          .expect(201)
          .expect(mockAdelcoOrder);
      });
    });

    describe('when not send x-user-id', () => {
      const businessUnitId = 'business-unit-id';

      it('should throw an error when User ID Missing', () => {
        return request(app.getHttpServer())
          .post(`${url}/${businessUnitId}/orders/convert-active-cart`)
          .send({ paymentMethod: 'Cash', source: 'ecomm' })
          .expect(400)
          .expect({ statusCode: 400, message: 'User ID missing' });
      });
    });

    describe('when not send x-user-roles', () => {
      const xUserId = 'username@username.com';
      const businessUnitId = 'business-unit-id';

      it('should throw an error when User ID Missing', () => {
        return request(app.getHttpServer())
          .post(`${url}/${businessUnitId}/orders/convert-active-cart`)
          .set('x-user-id', xUserId)
          .send({ paymentMethod: 'Cash', source: 'ecomm' })
          .expect(400)
          .expect({ statusCode: 400, message: 'User Roles missing' });
      });
    });

    describe('when cartId send it not match with active cart', () => {
      const xUserId = 'username@username.com';
      const businessUnitId = 'business-unit-id';

      it('should convert the cart to Order and return Adelco Order', () => {
        return request(app.getHttpServer())
          .post(`${url}/${businessUnitId}/orders/convert-active-cart`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', '[]')
          .send({ paymentMethod: 'Cash', source: 'ecomm', cartId: 'not-match' })
          .expect(400)
          .expect({ statusCode: 400, message: 'Cart ID does not match with current cart', code: 'Orders-042' });
      });
    });

    describe('when cart has invalidStockOrPrice', () => {
      const xUserId = 'username@username.com';
      const businessUnitId = 'business-unit-id-cart-no-stock';

      describe('when force update is false', () => {
        it('should return business units updated by id', () => {
          return request(app.getHttpServer())
            .post(`${url}/${businessUnitId}/orders/convert-active-cart?forceUpdate=false`)
            .set('x-user-id', xUserId)
            .set('x-user-roles', '[]')
            .send({ paymentMethod: 'Cash', source: 'ecomm' })
            .expect(400)
            .expect({ statusCode: 400, message: 'Invalid Stock or Price', code: 'Orders-034' });
        });
      });

      describe('when force update is true', () => {
        it('should return Adelco Order including the transtient properties', () => {
          return request(app.getHttpServer())
            .post(`${url}/${businessUnitId}/orders/convert-active-cart?forceUpdate=true`)
            .set('x-user-id', xUserId)
            .set('x-user-roles', '[]')
            .send({ paymentMethod: 'Cash', source: 'ecomm' })
            .expect(201)
            .expect(mockAdelcoOrderWithCartUpdatesOrder);
        });
      });
    });

    describe('when cart has minimumAmount', () => {
      const xUserId = 'username@username.com';
      const businessUnitId = 'business-unit-id';

      it('should return business units updated by id', () => {
        mockSvcBusinessUnitsService.getById.mockResolvedValueOnce({ ...mockGetById, minimumOrderAmount: { ...mockGetById.minimumOrderAmount, centAmount: 1000000 } });
        return request(app.getHttpServer())
          .post(`${url}/${businessUnitId}/orders/convert-active-cart`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', '[]')
          .send({ paymentMethod: 'Cash', source: 'ecomm' })
          .expect(400)
          .expect({ statusCode: 400, message: 'Invalid Minimum order amount', code: 'Orders-035' });
      });
    });

    describe('when does not have next delivery dates', () => {
      const xUserId = 'username@username.com';
      const businessUnitId = 'business-unit-id';

      it('should throw doesNotHaveNextDeliveryDates', () => {
        mockGetNextDeliveryDates.deliveryDates = [];
        return request(app.getHttpServer())
          .post(`${url}/${businessUnitId}/orders/convert-active-cart`)
          .set('x-user-id', xUserId)
          .set('x-user-roles', '[]')
          .send({ paymentMethod: 'Cash', source: 'ecomm' })
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Does not have next delivery dates',
            code: 'Orders-037'
          });
      });
    });
  });
});
