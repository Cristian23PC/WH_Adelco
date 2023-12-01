global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve()
  })
) as jest.Mock;

const mockCartsRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('notfound-anonymous-id'))) return Promise.resolve({ results: [] });
    if (queryArgs?.where.some(condition => condition.match('missmatch-anonymous-id')))
      return Promise.resolve({
        results: [
          {
            ...mockCommercetoolsCartResponse,
            custom: {
              ...mockCommercetoolsCartResponse.custom,
              fields: {
                ...mockCommercetoolsCartResponse.custom.fields,
                deliveryZone: { ...mockCommercetoolsCartResponse.custom.fields.deliveryZone, id: 'delivery-zone-missmatch-id' }
              }
            }
          }
        ]
      });
    if (queryArgs?.where.some(condition => condition.match('delete-anonymous-id'))) return Promise.resolve({ results: [mockCommercetoolsCartWithLineItemResponse] });
    if (queryArgs?.where.some(condition => condition.match('delivery-zone-missing-data-anonymous-id')))
      return Promise.resolve({
        results: [
          {
            ...mockCommercetoolsCartWithDeliveryZoneResponse,
            custom: {
              ...mockCommercetoolsCartResponse.custom,
              fields: {
                ...mockCommercetoolsCartResponse.custom.fields,
                deliveryZone: { typeId: 'key-reference', id: 'delivery-zone-missing-data-id', obj: { key: 'delivery-zone-missing-data-id', value: { dcCode: 'dcCode' } } }
              }
            }
          }
        ]
      });
    if (queryArgs?.where.some(condition => condition.match('update-quantity-anonymous-id')))
      return Promise.resolve({
        results: [mockCommercetoolsCartWithLineItemVariantAndCustomFieldsResponse]
      });
    if (queryArgs?.where.some(condition => condition.match('delivery-zone-missing-data-id')))
      return Promise.resolve({
        results: [mockCommercetoolsCartWithMissingDeliveryZoneMissingDataResponse]
      });
    if (queryArgs?.where.some(condition => condition.match('unable-determine-product-stock-id')))
      return Promise.resolve({
        results: [mockCommercetoolsCartWithUnableToDeterminateProductStockResponse]
      });
    if (queryArgs?.where.some(condition => condition.match('not-product-stock-id')))
      return Promise.resolve({
        results: [mockCommercetoolsCartWithNoProductStockResponse]
      });
    if (queryArgs?.where.some(condition => condition.match('delivery-zone-different-dc-code')))
      return Promise.resolve({
        results: [
          {
            ...mockCommercetoolsCartWithDeliveryZoneResponse,
            custom: {
              ...mockCommercetoolsCartResponse.custom,
              fields: {
                ...mockCommercetoolsCartResponse.custom.fields,
                deliveryZone: { typeId: 'key-reference', id: 'delivery-zone-different-dc-code', obj: { key: 'delivery-zone-different-dc-code', value: { dcCode: 'dcCode' } } }
              }
            }
          }
        ]
      });

    return Promise.resolve({
      results: [mockCommercetoolsCartWithDeliveryZoneResponse]
    });
  }),
  deleteById: jest.fn(() => {}),
  updateById: jest.fn(() => {
    return Promise.resolve(mockCommercetoolsCartResponse);
  })
};

const mockCustomObjectRepository = {
  getByContainerAndKey: jest.fn((container: string, key: string) => {
    if (key === 'delivery-zone-missing-data-id') return Promise.resolve({ value: {} });
    if (key === 'delivery-zone-different-dc-code') return Promise.resolve({ value: { dcCode: 'dcCode', t2Rate: 't2Rate' } });

    return Promise.resolve({ value: { dcCode: 'key', t2Rate: 't2Rate' } });
  }),
  findByContainer: jest.fn((container: string, { queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('not-found-delivery-zone-id'))) return Promise.resolve({ results: [] });

    return Promise.resolve({ results: [mockDeliveryZonesResponse] });
  })
};

const mockChannelsRepository = {
  find: jest.fn(() => {
    return Promise.resolve({
      results: [
        {
          id: 'channelId',
          key: 'key',
          roles: ['InventorySupply']
        }
      ]
    });
  })
};

const mockProductProjectionsRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('not-found-sku'))) return Promise.resolve({ results: [] });
    if (queryArgs?.where.some(condition => condition.match('not-availability-sku')))
      return Promise.resolve({ results: [{ ...mockProductProjection, masterVariant: { ...mockProductProjection.masterVariant, sku: 'not-availability-sku' } }] });
    if (queryArgs?.where.some(condition => condition.match('not-product-stock-id')))
      return Promise.resolve({
        results: [
          {
            ...mockProductProjection,
            masterVariant: {
              ...mockProductProjection.masterVariant,
              sku: 'not-product-stock-id',
              availability: {
                channels: {
                  channelId: {
                    isOnStock: false,
                    availableQuantity: 5,
                    version: 927,
                    id: 'c76c4aaf-d9b0-4c84-b79e-fd726e7e4d5e'
                  }
                }
              }
            }
          }
        ]
      });

    return Promise.resolve({
      results: [
        {
          ...mockProductProjection,
          masterVariant: {
            ...mockProductProjection.masterVariant,
            availability: {
              channels: {
                channelId: {
                  isOnStock: true,
                  availableQuantity: 5,
                  version: 927,
                  id: 'c76c4aaf-d9b0-4c84-b79e-fd726e7e4d5e'
                }
              }
            }
          }
        }
      ]
    });
  })
};

const mockInventoryRepository = {
  find: jest.fn(() => {
    return Promise.resolve({ results: [] });
  })
};

const mockCustomersRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('nocustomer@adelco.com'))) {
      return Promise.resolve({ results: [] });
    }
    return Promise.resolve({ results: [mockCommercetoolsCustomerResponse] });
  })
};

const mockBusinessUnitsRepository = {
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string[] } }) => {
    if (queryArgs?.where.some(condition => condition.match('no-bu'))) {
      return Promise.resolve({ results: [] });
    }
    return Promise.resolve({ results: [mockCompanyBusinessUnit] });
  })
};

const createMockedDate = (mockDate: Date) => {
  const currentDate = mockDate;

  class MockedDate extends Date {
    constructor(...args: any[]) {
      super(args.length === 0 ? currentDate.getTime() : args[0]);
    }
    static now() {
      return currentDate.getTime();
    }
  }

  (global as any).Date = MockedDate;

  return {
    restore: () => {
      (global as any).Date = Date;
    }
  };
};

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CartsRepository,
  ChannelsRepository,
  CustomObjectsRepository,
  CustomersRepository,
  InventoryRepository,
  MeCartsRepository,
  ProductProjectionsRepository
} from 'commercetools-sdk-repositories';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { CommercetoolsExceptionFilter } from '@/common/filters/commercetools.exception.filter';
import { ApiErrorFilter } from '@/common/filters/api.exception.filter';
import { CartsService } from '@/carts/carts.service';
import {
  mockAdelcoCartResponse,
  mockAdelcoCartWithDeliveryZoneResponse,
  mockCommercetoolsCartResponse,
  mockCommercetoolsCartWithDeliveryZoneResponse,
  mockCommercetoolsCartWithLineItemResponse,
  mockCommercetoolsCartWithLineItemVariantAndCustomFieldsResponse,
  mockCommercetoolsCartWithMissingDeliveryZoneMissingDataResponse,
  mockCommercetoolsCartWithNoProductStockResponse,
  mockCommercetoolsCartWithUnableToDeterminateProductStockResponse
} from '@/carts/__mock__/carts.mock';
import { anonymousHeaderId } from '@/common/constants/headers';
import { CartsController } from '../carts.controller';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { ProductsService } from '@/products/products.service';
import { ChannelsService } from '@/channels/channels.service';
import { mockProductProjection } from '@/products/__mocks__/products.mock';
import { mockDeliveryZonesResponse } from '@/delivery-zones/__mocks__/delivery-zones.mock';
import { CartsHelperService } from '@/carts-helper/carts-helper.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CustomersService } from '@/customers/customers.service';
import { BusinessUnitsService } from '@/business-unit/business-units.service';
import { NotificationsService } from '@/notifications';
import { mockCommercetoolsCustomerResponse } from '@/customers/__mocks__/customers.mock';
import { mockCompanyBusinessUnit } from '@/business-unit/__mocks__/business-units.mock';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { OrderContactRequestDto } from '../dto/orderContactRequest';

describe('carts', () => {
  let app: INestApplication;

  const mockDate = new Date('2023-08-14T12:00:00.000Z');
  const mockedDate = createMockedDate(mockDate);

  afterAll(() => {
    mockedDate.restore();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
      providers: [
        CartsService,
        DeliveryZonesService,
        ProductsService,
        ChannelsService,
        CartsHelperService,
        CustomersService,
        BusinessUnitsService,
        NotificationsService,
        {
          provide: CustomersRepository,
          useValue: mockCustomersRepository
        },
        {
          provide: BusinessUnitsRepository,
          useValue: mockBusinessUnitsRepository
        },
        {
          provide: ProductProjectionsRepository,
          useValue: mockProductProjectionsRepository
        },
        {
          provide: CustomObjectsRepository,
          useValue: mockCustomObjectRepository
        },
        {
          provide: ChannelsRepository,
          useValue: mockChannelsRepository
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn()
          }
        },
        {
          provide: MeCartsRepository,
          useValue: {}
        },
        {
          provide: CartsRepository,
          useValue: mockCartsRepository
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(key => {
              if (key === 'cart.anonymousHeaderId') return anonymousHeaderId;
              if (key === 'custom-object.t2zoneContainer') return 'delivery-zone';
              if (key === 'cartsHelper.salesCartVerificationTimeMinutes') return 300;
              if (key === 'cartsHelper.ecommerceCartVerificationTimeMinutes') return 300;

              return key;
            })
          }
        },
        {
          provide: InventoryRepository,
          useValue: mockInventoryRepository
        }
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter()).useGlobalFilters(new CommercetoolsExceptionFilter()).useGlobalFilters(new ApiErrorFilter());

    await app.init();
  });

  describe('GET /carts/anonymous-cart?delivery-zones=:deliveryZoneId', () => {
    const url = (deliveryZoneId: string, forceUpdate?: boolean) => `/carts/anonymous-cart?deliveryZone=${deliveryZoneId}${forceUpdate ? '&forceUpdate=true' : ''}`;

    describe('when success', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer()).get(url('delivery-zone-id')).set('x-anonymous-id', xAnonymousId).expect(200).expect(mockAdelcoCartWithDeliveryZoneResponse);
      });
    });

    describe('when header x-anonymous-id is not set', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return BadRequestException missing anonymous id', () => {
        return request(app.getHttpServer()).get(url('delivery-zone-id')).expect(400).expect({ statusCode: 400, message: 'Anonymous ID missing' });
      });
    });

    describe('when not found active cart', () => {
      const xAnonymousId = 'notfound-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return NotFound active cart', () => {
        return request(app.getHttpServer())
          .get(url('delivery-zone-id'))
          .set('x-anonymous-id', xAnonymousId)
          .expect(404)
          .expect({ statusCode: 404, message: 'Not active cart for this user.' });
      });
    });

    describe('when cart have missmatch delivery zone', () => {
      const xAnonymousId = 'missmatch-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .get(url('delivery-zone-id'))
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({ statusCode: 400, message: 'Delivery Zone Missmatch' });
      });
    });
  });

  describe('DELETE /carts/anonymous-cart/line-items/:id', () => {
    const url = (lineItemId: string, forceUpdate?: boolean) => `/carts/anonymous-cart/line-items/${lineItemId}${forceUpdate ? '?forceUpdate=true' : ''}`;

    describe('when success', () => {
      const xAnonymousId = 'delete-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return a cart without the line item', () => {
        return request(app.getHttpServer()).delete(url('lineItem-id')).set('x-anonymous-id', xAnonymousId).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-anonymous-id is not set', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return BadRequestException missing anonymous id', () => {
        return request(app.getHttpServer()).delete(url('lineItem-id')).expect(400).expect({ statusCode: 400, message: 'Anonymous ID missing' });
      });
    });

    describe('when not found active cart', () => {
      const xAnonymousId = 'notfound-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return NotFound active cart', () => {
        return request(app.getHttpServer())
          .delete(url('delivery-zone-id'))
          .set('x-anonymous-id', xAnonymousId)
          .expect(404)
          .expect({ statusCode: 404, message: 'Not active cart for this user.' });
      });
    });

    describe('when line item not found', () => {
      const xAnonymousId = 'missmatch-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw not found line item', () => {
        return request(app.getHttpServer()).delete(url('lineItem-id')).set('x-anonymous-id', xAnonymousId).expect(404).expect({ statusCode: 404, message: 'Line item not found' });
      });
    });

    describe('when success with forceUpdate param', () => {
      const xAnonymousId = 'delete-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return a cart without the line item', () => {
        return request(app.getHttpServer())
          .delete(url('lineItem-id', true))
          .set('x-anonymous-id', xAnonymousId)
          .expect(200)
          .expect({ ...mockAdelcoCartResponse, cartUpdates: { isQuantityUpdated: false, isPriceUpdated: false } });
      });
    });
  });

  describe('PATCH /carts/anonymous-cart/line-items/:id/quantity', () => {
    const url = (lineItemId: string, forceUpdate?: boolean) => `/carts/anonymous-cart/line-items/${lineItemId}/quantity${forceUpdate ? '?forceUpdate=true' : ''}`;

    describe('when success', () => {
      const xAnonymousId = 'update-quantity-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return a cart with the quantity updated of the line item', () => {
        return request(app.getHttpServer()).patch(url('lineItem-id')).set('x-anonymous-id', xAnonymousId).expect(200).expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-anonymous-id is not set', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return BadRequestException missing anonymous id', () => {
        return request(app.getHttpServer()).patch(url('lineItem-id')).expect(400).expect({ statusCode: 400, message: 'Anonymous ID missing' });
      });
    });

    describe('when not found active cart', () => {
      const xAnonymousId = 'notfound-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return NotFound active cart', () => {
        return request(app.getHttpServer())
          .patch(url('lineItem-id'))
          .set('x-anonymous-id', xAnonymousId)
          .expect(404)
          .expect({ statusCode: 404, message: 'Not active cart for this user.' });
      });
    });

    describe('when line item not found', () => {
      const xAnonymousId = 'missmatch-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw not found line item', () => {
        return request(app.getHttpServer()).patch(url('lineItem-id')).set('x-anonymous-id', xAnonymousId).expect(404).expect({ statusCode: 404, message: 'Line item not found' });
      });
    });

    describe('when delivery zone missing data', () => {
      const xAnonymousId = 'delivery-zone-missing-data-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw delivery zone missing data', () => {
        return request(app.getHttpServer())
          .patch(url('lineItem-id'))
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({ statusCode: 400, message: 'Delivery zone missing data' });
      });
    });

    describe('when is unable to determine product stock', () => {
      const xAnonymousId = 'unable-determine-product-stock-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw product availability not found in the supply channel', () => {
        return request(app.getHttpServer())
          .patch(url('lineItem-id'))
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({ statusCode: 400, message: 'There are not enough units in stock', code: 'Carts-026', meta: { sku: 'sku1', dcCode: 'key', availableQuantity: 0 } });
      });
    });

    describe('when Product is not on stock', () => {
      const xAnonymousId = 'not-product-stock-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should throw Product is not on stock', () => {
        return request(app.getHttpServer())
          .patch(url('lineItem-id'))
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'There are not enough units in stock',
            code: 'Carts-026',
            meta: { sku: 'sku1', dcCode: 'key', availableQuantity: 0 }
          });
      });
    });

    describe('when success with forceUpdate param', () => {
      const xAnonymousId = 'update-quantity-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return a cart with the quantity updated of the line item', () => {
        return request(app.getHttpServer())
          .patch(url('lineItem-id', true))
          .set('x-anonymous-id', xAnonymousId)
          .expect(200)
          .expect({ ...mockAdelcoCartResponse, cartUpdates: { isQuantityUpdated: false, isPriceUpdated: false } });
      });
    });
  });

  describe('POST /carts/anonymous-cart/line-items', () => {
    const url = (deliveryZoneId: string, forceUpdate?: boolean) => `/carts/anonymous-cart/line-items?deliveryZone=${deliveryZoneId}${forceUpdate ? '&forceUpdate=true' : ''}`;

    describe('when success', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-id'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(201)
          .expect(mockAdelcoCartResponse);
      });
    });

    describe('when header x-anonymous-id is not set', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return BadRequestException missing anonymous id', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-id'))
          .send({ sku: 'sku1', quantity: 1 })
          .expect(400)
          .expect({ statusCode: 400, message: 'Anonymous ID missing' });
      });
    });

    describe('when not found delivery zone', () => {
      const xAnonymousId = 'notfound-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should response 404 NotFound delivery zone', () => {
        return request(app.getHttpServer())
          .post(url('not-found-delivery-zone-id'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(404)
          .expect({ statusCode: 404, message: 'Delivery zone not found' });
      });
    });

    describe('when delivery zone mismatch', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should response 400 with delivery zone missmatch', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-missing-data-id'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({ statusCode: 400, message: 'Delivery Zone Missmatch' });
      });
    });

    describe('when product has not found', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should not found the product', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-id'))
          .send({ sku: 'not-found-sku', quantity: 1 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({ statusCode: 400, message: 'Product not found', code: 'Carts-034', meta: { sku: 'not-found-sku', dcCode: 'key', distributionChannelId: 'channelId' } });
      });
    });

    describe('when product availability not found in the supply channel', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return a 400 with product availability not found in the supply channel', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-id'))
          .send({ sku: 'not-availability-sku', quantity: 1 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'There are not enough units in stock',
            code: 'Carts-026',
            meta: { sku: 'not-availability-sku', dcCode: 'key', quantity: 1, availableQuantity: 0 }
          });
      });
    });

    describe('when not enough units in stock', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return 400 when not enough units in stock', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-id'))
          .send({ sku: 'sku1', quantity: 100 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'There are not enough units in stock',
            code: 'Carts-026',
            meta: { sku: 'sku1', dcCode: 'key', quantity: 100, availableQuantity: 5 }
          });
      });
    });

    describe('when product is non in stock', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return 400 when not enough units in stock', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-id'))
          .send({ sku: 'not-product-stock-id', quantity: 1 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'There are not enough units in stock',
            code: 'Carts-026',
            meta: {
              sku: 'not-product-stock-id',
              dcCode: 'key',
              quantity: 1,
              availableQuantity: 0
            }
          });
      });
    });

    describe('when supply channel ${dcCode} not found', () => {
      const xAnonymousId = 'delivery-zone-different-dc-code';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return 400 when supply channel not found', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-different-dc-code'))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(400)
          .expect({ statusCode: 400, message: 'Supply channel dcCode not found' });
      });
    });

    describe('when success with forceUpdate param', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return an active cart', () => {
        return request(app.getHttpServer())
          .post(url('delivery-zone-id', true))
          .send({ sku: 'sku1', quantity: 1 })
          .set('x-anonymous-id', xAnonymousId)
          .expect(201)
          .expect({ ...mockAdelcoCartResponse, cartUpdates: { isQuantityUpdated: false, isPriceUpdated: false } });
      });
    });
  });

  describe('DELETE /carts/anonymous-cart', () => {
    const url = `/carts/anonymous-cart`;

    describe('when success', () => {
      const xAnonymousId = 'delete-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return a cart without the line item', () => {
        return request(app.getHttpServer()).delete(url).set('x-anonymous-id', xAnonymousId).expect(204);
      });
    });

    describe('when header x-anonymous-id is not set', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return BadRequestException missing anonymous id', () => {
        return request(app.getHttpServer()).delete(url).expect(400).expect({ statusCode: 400, message: 'Anonymous ID missing' });
      });
    });

    describe('when not found active cart', () => {
      const xAnonymousId = 'notfound-anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return NotFound active cart', () => {
        return request(app.getHttpServer()).delete(url).set('x-anonymous-id', xAnonymousId).expect(404).expect({ statusCode: 404, message: 'Not active cart for this user.' });
      });
    });
  });

  describe('POST /carts/anonymous-cart/order-contact-request', () => {
    const url = '/carts/anonymous-cart/order-contact-request';
    const body: OrderContactRequestDto = {
      username: 'email@email.com',
      rut: 'rut',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone',
      address: {
        country: 'CL',
        region: 'region',
        commune: 'commune',
        city: 'city',
        streetName: 'streetName',
        streetNumber: 'streetNumber',
        apartment: 'apartment',
        otherInformation: 'otherInformation',
        coordinates: { lat: 1, long: 1 }
      },
      billingAddress: {
        country: 'CL',
        region: 'region',
        commune: 'commune',
        city: 'city',
        streetName: 'streetName',
        streetNumber: 'streetNumber',
        apartment: 'apartment',
        otherInformation: 'otherInformation',
        coordinates: { lat: 1, long: 1 }
      }
    };

    beforeEach(() => {
      const assetsFetchMock = () => {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockCompanyBusinessUnit
        } as Response);
      };
      jest.spyOn(global, 'fetch').mockImplementation(assetsFetchMock);
    });

    describe('when success', () => {
      const xAnonymousId = 'anonymous-id';

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should find a BU and send the email of order contact request', () => {
        return request(app.getHttpServer()).post(url).send(body).set('x-anonymous-id', xAnonymousId).expect(200);
      });

      it('should not find a BU but customer exist in another bu. Should create fake customer and send the email of order contact request', () => {
        return request(app.getHttpServer())
          .post(url)
          .send({ ...body, rut: 'no-bu' })
          .set('x-anonymous-id', xAnonymousId)
          .expect(200);
      });

      it('should not find a BU and customer. Should create fake customer, new bu and send the email of order contact request', () => {
        return request(app.getHttpServer())
          .post(url)
          .send({ ...body, rut: 'no-bu', email: 'nocustomer@adelco.com' })
          .set('x-anonymous-id', xAnonymousId)
          .expect(200);
      });
    });

    describe('when header x-anonymous-id is not set', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should return BadRequestException missing anonymous id', () => {
        return request(app.getHttpServer()).post(url).send(body).expect(400).expect({ statusCode: 400, message: 'Anonymous ID missing' });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
