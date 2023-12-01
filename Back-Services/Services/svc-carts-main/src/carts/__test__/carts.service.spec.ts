/* eslint-disable @typescript-eslint/unbound-method */
const mockCartsRepository = {
  updateById: jest.fn((id: string) => (id === 'updateById-error' ? Promise.reject(new Error()) : Promise.resolve({ id, version: 2 }))),
  deleteById: jest.fn((id: string) => (id === 'updateById-error' ? Promise.reject(new Error()) : Promise.resolve({ id, version: 2 }))),
  find: jest.fn((methodArgs: { queryArgs: { where: string[] } }) => {
    if (methodArgs.queryArgs.where[1].indexOf('createdBy="notfound@notfound.com"') >= 0 || methodArgs.queryArgs.where[1].indexOf('anonymousId="notfound-anonymous-id"') >= 0) {
      return Promise.resolve({ results: [] });
    }
    if (methodArgs.queryArgs.where[1].indexOf('createdBy="failure@failure.com"') >= 0 || methodArgs.queryArgs.where[1].indexOf('anonymousId="failure"') >= 0) {
      return Promise.reject(new CommercetoolsError(mockCommercetoolsErrorMalformed));
    }
    return Promise.resolve({ results: [mockCommercetoolsCartResponse] });
  }),
  create: jest.fn(({ body }) => (body?.custom?.fields?.createdBy === 'create-error@mail.com' ? Promise.reject(new Error()) : Promise.resolve({ ...body, id: 'id', version: 1 })))
};

/* eslint-disable @typescript-eslint/unbound-method */
const mockChannelsRepository = {
  find: jest.fn(() => {
    return Promise.resolve({
      results: [{ ...mockChannelCustomer, custom: { ...mockChannelCustomer.custom, fields: { ...mockChannelCustomer.custom.fields, distributionCenter: 'dcCode' } } }]
    });
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CartsRepository: jest.fn().mockImplementation(() => mockCartsRepository),
  ChannelsRepository: jest.fn().mockImplementation(() => mockChannelsRepository)
}));

const mockChannelsService = {
  getSupplyChannels: jest.fn().mockImplementation(() => Promise.resolve(supplyChannelsMock))
};

jest.mock('@/channels/channels.service', () => ({
  ChannelsService: jest.fn().mockImplementation(() => mockChannelsService)
}));

const mockDeliveryZonesService = {
  getAndValidateDeliveryZone: jest.fn(() =>
    Promise.resolve({
      dcCode: 'dcCode',
      t2Rate: 't2rate'
    })
  ),
  getById: jest.fn(() => {
    return Promise.resolve(mockDeliveryZonesResponse);
  })
};

jest.mock('@/delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZonesService)
}));

jest.mock('@/common/formatter/formatter', () => ({
  formatRut: jest.fn().mockImplementation(rut => rut)
}));

const mockCartsHelperService = {
  getProductsDraftAndLineItemsIdsToDelete: jest.fn().mockImplementation(() => {
    return {
      productsDraft: [{ sku: 'sku' }],
      lineItemsIdsToDelete: []
    };
  }),
  validateStock: jest.fn(() => Promise.resolve()),
  getProductForCart: jest.fn(() => Promise.resolve({ sku: 'sku' })),
  getDefaultDistributionChannelForDeliveryZone: jest.fn(() => Promise.resolve('defaultDch')),
  buildLineItemActions: jest.fn().mockImplementation(() => []),
  buildCustomFieldActions: jest.fn().mockImplementation(() => [])
};

jest.mock('@/carts-helper/carts-helper.service', () => ({
  CartsHelperService: jest.fn().mockImplementation(() => mockCartsHelperService)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'cart.currency':
        return 'CLP';
      case 'cart.csrEmail':
        return 'adelcoCsr@adelco.com';
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

jest.mock('@/config/logger.config', () => jest.fn());

const mockLoggerService = {
  log: jest.fn()
};

jest.mock('@/common/utils', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

const mockBusinessUnitsService = {
  findByRut: jest.fn().mockImplementation((rut: string) => {
    if (rut === 'no-bu') {
      return Promise.resolve();
    }
    return Promise.resolve(mockCompanyBusinessUnit);
  }),
  findBusinessUnitByAssociateId: jest.fn().mockImplementation((customerId: string) => {
    if (!customerId) {
      return Promise.resolve();
    }

    return Promise.resolve(mockCompanyBusinessUnit);
  }),
  repRegistration: jest.fn().mockImplementation(() => {
    return Promise.resolve(mockCompanyBusinessUnit);
  })
};

jest.mock('@/business-unit/business-units.service', () => ({
  BusinessUnitsService: jest.fn().mockImplementation(() => mockBusinessUnitsService)
}));

const mockCustomersService = {
  getCustomerByEmail: jest.fn().mockImplementation((email: string) => {
    if (email === 'nocustomer@adelco.com') {
      return Promise.resolve();
    }

    return Promise.resolve(mockCommercetoolsCustomerResponse);
  })
};

jest.mock('@/customers/customers.service', () => ({
  CustomersService: jest.fn().mockImplementation(() => mockCustomersService)
}));

const mockNotificationsService = {
  sendNotification: jest.fn().mockImplementation(() => Promise.resolve())
};

jest.mock('@/notifications', () => ({
  NotificationsService: jest.fn().mockImplementation(() => mockNotificationsService)
}));

jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));

import { Cart, CartDraft, CartUpdateAction, LineItem, LineItemDraft } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CartsRepository } from 'commercetools-sdk-repositories';
import { CartsService } from '../carts.service';
import { QueryArgsDto } from '../dto/queryargs.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CommercetoolsError } from '@/nest-commercetools';
import {
  mockCommercetoolsCartResponse,
  mockCommercetoolsCartWithDeliveryZoneResponse,
  mockCommercetoolsCartWithLineItemAndDeliveryZoneCustomFieldResponse,
  mockCommercetoolsCartWithLineItemResponse,
  mockCommercetoolsErrorMalformed
} from '../__mock__/carts.mock';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { mockDeliveryZonesResponse } from '@/delivery-zones/__mocks__/delivery-zones.mock';
import { CartsHelperService } from '@/carts-helper/carts-helper.service';
import { mockChannelCustomer } from '@/business-unit/__mocks__/channels.mock';
import { supplyChannelsMock } from '@/channels/__mocks__/channels.mock';
import { ChannelsService } from '@/channels/channels.service';
import { ECOMM_SOURCE_CUSTOM_FIELD, SALES_SOURCE_CUSTOM_FIELD } from '@/common/constants/carts';
import { OrderContactRequestDto } from '../dto/orderContactRequest';
import { BusinessUnitsService } from '@/business-unit/business-units.service';
import { CustomersService } from '@/customers/customers.service';
import { NotificationsService } from '@/notifications';
import { mockCommercetoolsCustomerResponse } from '@/customers/__mocks__/customers.mock';
import { mockCompanyBusinessUnit } from '@/business-unit/__mocks__/business-units.mock';
import { MAIL_NOTIFICATION_TOPIC } from '@/common/constants/topics';

describe('CartsService', () => {
  let service: CartsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartsService,
        DeliveryZonesService,
        ChannelsService,
        CartsHelperService,
        CartsRepository,
        BusinessUnitsService,
        CustomersService,
        NotificationsService,
        ConfigService
      ]
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  describe('create', () => {
    let cartDraft: Partial<CartDraft>;
    let queryArgs: QueryArgsDto;
    let response: Cart | Error;
    let buId: string;
    let username: string;
    let externalId: string;
    let buKey: string;
    let rut: string;

    beforeAll(() => {
      queryArgs = { expand: 'expand' };
    });

    describe('when CartsRepository.create success', () => {
      let expectedResponse;

      describe('when currency provided', () => {
        beforeAll(() => {
          externalId = 'externalId';
          buKey = 'bu-key';
          buId = 'bu-id';
          username = 'user@mail.com';
          rut = 'rut';
          cartDraft = {
            currency: 'CLP',
            inventoryMode: 'ReserveOnOrder',
            taxMode: 'External',
            taxCalculationMode: 'LineItemLevel',
            taxRoundingMode: 'HalfUp',
            custom: {
              type: {
                key: 'adelco-cart-type',
                typeId: 'type'
              },
              fields: {
                uniqueSkuCount: 1,
                createdBy: username,
                source: ECOMM_SOURCE_CUSTOM_FIELD,
                ctBuId: buId,
                buKey,
                sapBuId: externalId,
                buRut: rut
              }
            },
            businessUnit: {
              typeId: 'business-unit',
              id: buId
            }
          };
          expectedResponse = { ...cartDraft, lineItems: [{ sku: 'sku', quantity: 1 }], id: 'id', version: 1 };
        });

        beforeEach(async () => {
          response = await service.create({ lineItems: [{ sku: 'sku', quantity: 1 }] }, username, buId, buKey, rut, externalId, queryArgs);
        });

        it('should call CartsRepository.create', () => {
          expect(mockCartsRepository.create).toHaveBeenCalledWith({
            queryArgs,
            body: { ...cartDraft, lineItems: [{ sku: 'sku', quantity: 1 }] }
          });
        });

        it('should return CartsRepository.create response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });

    describe('when CartsRepository.create rejects', () => {
      describe('when currency provided', () => {
        beforeAll(() => {
          buId = 'bu-id';
          username = 'create-error@mail.com';
          externalId = 'externalId';
          buKey = 'bu-key';
          rut = 'rut';
          cartDraft = {
            currency: 'CLP',
            inventoryMode: 'ReserveOnOrder',
            taxMode: 'External',
            taxCalculationMode: 'LineItemLevel',
            taxRoundingMode: 'HalfUp',
            custom: {
              type: {
                key: 'adelco-cart-type',
                typeId: 'type'
              },
              fields: {
                uniqueSkuCount: 1,
                createdBy: username,
                source: SALES_SOURCE_CUSTOM_FIELD,
                ctBuId: buId,
                buKey,
                sapBuId: externalId,
                buRut: rut
              }
            },
            businessUnit: {
              typeId: 'business-unit',
              id: buId
            }
          };
        });

        beforeEach(async () => {
          try {
            response = await service.create({ lineItems: [{ sku: 'sku', quantity: 1 }] }, username, buId, buKey, rut, externalId, queryArgs, SALES_SOURCE_CUSTOM_FIELD);
          } catch (error) {
            response = error as Error;
          }
        });

        it('should call CartsRepository.create', () => {
          expect(mockCartsRepository.create).toHaveBeenCalledWith({
            queryArgs,
            body: { ...cartDraft, lineItems: [{ sku: 'sku', quantity: 1 }] }
          });
        });

        it('should throw CartsRepository.create error', () => {
          expect(response).toBeInstanceOf(Error);
        });
      });
    });
  });

  describe('getActiveCart', () => {
    let response: NotFoundException | CommercetoolsError | Cart;

    describe('when success', () => {
      describe('when carts are found', () => {
        beforeEach(async () => {
          response = await service.getActiveCart('username@username.com', 'Pritty');
        });

        it('should call CartsRepository.find', () => {
          expect(mockCartsRepository.find).toHaveBeenCalledWith({
            queryArgs: { limit: 1, where: ['cartState="Active"', `custom(fields(createdBy="username@username.com"))`, 'businessUnit(key="Pritty")'] }
          });
        });

        it('should return Cart', () => {
          expect(response).toEqual(mockCommercetoolsCartResponse);
        });
      });

      describe('when no carts are found', () => {
        beforeEach(async () => {
          try {
            await service.getActiveCart('notfound@notfound.com');
          } catch (e) {
            response = e as NotFoundException;
          }
        });

        it('should call CartsRepository.find', () => {
          expect(mockCartsRepository.find).toHaveBeenCalledWith({
            queryArgs: { limit: 1, where: ['cartState="Active"', `custom(fields(createdBy="notfound@notfound.com"))`] }
          });
        });

        it('should return a 404 Error', () => {
          expect(response).toEqual(new NotFoundException('Not active cart for this user.'));
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      beforeEach(async () => {
        try {
          await service.getActiveCart('failure@failure.com');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CartsRepository.find', () => {
        expect(mockCartsRepository.find).toHaveBeenCalledWith({
          queryArgs: { limit: 1, where: ['cartState="Active"', `custom(fields(createdBy="failure@failure.com"))`] }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(new CommercetoolsError(mockCommercetoolsErrorMalformed));
      });
    });
  });

  describe('getByBusinessUnitKey', () => {
    let response: NotFoundException | CommercetoolsError | Cart;

    describe('when success', () => {
      describe('when carts are found', () => {
        beforeEach(async () => {
          response = await service.getByBusinessUnitKey('username@username.com', 'Pritty');
        });

        it('should call CartsRepository.find', () => {
          expect(mockCartsRepository.find).toHaveBeenCalledWith({
            queryArgs: {
              expand: ['custom.fields.deliveryZone', 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'],
              limit: 1,
              where: ['businessUnit(key="Pritty")', 'custom(fields(createdBy="username@username.com"))', 'cartState="Active"']
            }
          });
        });

        it('should return Cart', () => {
          expect(response).toEqual(mockCommercetoolsCartResponse);
        });
      });

      describe('when no carts are found', () => {
        beforeEach(async () => {
          try {
            await service.getByBusinessUnitKey('notfound@notfound.com', 'not-found');
          } catch (e) {
            response = e as NotFoundException;
          }
        });

        it('should call CartsRepository.find', () => {
          expect(mockCartsRepository.find).toHaveBeenCalledWith({
            queryArgs: {
              expand: ['custom.fields.deliveryZone', 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'],
              limit: 1,
              where: ['businessUnit(key="not-found")', 'custom(fields(createdBy="notfound@notfound.com"))', 'cartState="Active"']
            }
          });
        });

        it('should return a 404 Error', () => {
          expect(response).toEqual(new NotFoundException('Not active cart for this user.'));
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      beforeEach(async () => {
        try {
          await service.getByBusinessUnitKey('failure@failure.com', 'failure');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CartsRepository.find', () => {
        expect(mockCartsRepository.find).toHaveBeenCalledWith({
          queryArgs: {
            expand: ['custom.fields.deliveryZone', 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'],
            limit: 1,
            where: ['businessUnit(key="failure")', 'custom(fields(createdBy="failure@failure.com"))', 'cartState="Active"']
          }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(new CommercetoolsError(mockCommercetoolsErrorMalformed));
      });
    });
  });

  describe('getActiveCartByAnonymousId', () => {
    let response: NotFoundException | CommercetoolsError | Cart;

    describe('when success', () => {
      describe('when carts are found', () => {
        beforeEach(async () => {
          response = await service.getActiveCartByAnonymousId('anonymous-id');
        });

        it('should call CartsRepository.find', () => {
          expect(mockCartsRepository.find).toHaveBeenCalledWith({
            queryArgs: { limit: 1, where: ['cartState="Active"', `anonymousId="anonymous-id"`] }
          });
        });

        it('should return Cart', () => {
          expect(response).toEqual(mockCommercetoolsCartResponse);
        });
      });

      describe('when no carts are found', () => {
        beforeEach(async () => {
          try {
            await service.getActiveCartByAnonymousId('notfound-anonymous-id');
          } catch (e) {
            response = e as NotFoundException;
          }
        });

        it('should call CartsRepository.find', () => {
          expect(mockCartsRepository.find).toHaveBeenCalledWith({
            queryArgs: { limit: 1, where: ['cartState="Active"', `anonymousId="notfound-anonymous-id"`] }
          });
        });

        it('should return a 404 Error', () => {
          expect(response).toEqual(new NotFoundException('Not active cart for this user.'));
        });
      });
    });

    describe('when CommerceTools returns an error', () => {
      beforeEach(async () => {
        try {
          await service.getActiveCartByAnonymousId('failure');
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CartsRepository.find', () => {
        expect(mockCartsRepository.find).toHaveBeenCalledWith({
          queryArgs: { limit: 1, where: ['cartState="Active"', `anonymousId="failure"`] }
        });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(new CommercetoolsError(mockCommercetoolsErrorMalformed));
      });
    });
  });

  describe('updateCart', () => {
    let actions: CartUpdateAction[];
    let response: Error | Cart;

    describe('when updateCart successfully', () => {
      beforeEach(async () => {
        response = await service.updateCart('cart-id', 1, actions, {});
      });

      it('should call CartsRepository.updateById', () => {
        expect(mockCartsRepository.updateById).toHaveBeenCalledWith('cart-id', { body: { actions, version: 1 }, queryArgs: {} });
      });

      it('should return a Cart response', () => {
        expect(response).toEqual({ id: 'cart-id', version: 2 });
      });
    });

    describe('when CommerceTools returns an error', () => {
      beforeEach(async () => {
        try {
          await service.updateCart('updateById-error', 1, actions, {});
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CartsRepository.updateById', () => {
        expect(mockCartsRepository.updateById).toHaveBeenCalledWith('updateById-error', { body: { actions, version: 1 }, queryArgs: {} });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(new Error());
      });
    });
  });

  describe('removeLineItemAndSetCartCustomField', () => {
    let response: Error | Cart;
    let spy: jest.SpyInstance;
    beforeAll(() => {
      spy = jest.spyOn(service, 'updateCart').mockImplementation((id: string) => Promise.resolve({ id, version: 2 } as Cart));
    });

    describe('when removeLineItemAndSetCartCustomField successfully', () => {
      beforeEach(async () => {
        response = await service.removeLineItemAndSetCartCustomField('cart-id', 'lineItem-id', 1, 2, 'old-sku');
      });

      it('should call service.removeLineItemAndSetCartCustomField', () => {
        expect(spy).toHaveBeenCalledWith(
          'cart-id',
          1,
          [
            { action: 'removeLineItem', lineItemId: 'lineItem-id' },
            {
              action: 'setCustomField',
              name: 'uniqueSkuCount',
              value: 1
            }
          ],
          undefined
        );
      });

      it('should return a Cart response', () => {
        expect(response).toEqual({ id: 'cart-id', version: 2 });
      });
    });

    describe('when not send uniqueSkuCount and sku', () => {
      beforeEach(async () => {
        response = await service.removeLineItemAndSetCartCustomField('cart-id', 'lineItem-id', 1);
      });

      it('should call service.removeLineItemAndSetCartCustomField', () => {
        expect(spy).toHaveBeenCalledWith('cart-id', 1, [{ action: 'removeLineItem', lineItemId: 'lineItem-id' }], undefined);
      });

      it('should return a Cart response', () => {
        expect(response).toEqual({ id: 'cart-id', version: 2 });
      });
    });
  });

  describe('updateLineItemQuantity', () => {
    let response: Error | Cart;
    let spy: jest.SpyInstance;
    beforeAll(() => {
      spy = jest.spyOn(service, 'updateCart').mockImplementation((id: string) => Promise.resolve({ id, version: 2 } as Cart));
    });

    describe('when updateLineItemQuantity successfully', () => {
      beforeEach(async () => {
        response = await service.updateLineItemQuantity(5, 'cart-id', mockCommercetoolsCartWithLineItemResponse.lineItems[0], 1);
      });

      it('should call service.updateLineItemQuantity', () => {
        expect(spy).toHaveBeenCalledWith(
          'cart-id',
          1,
          [
            {
              action: 'changeLineItemQuantity',
              externalPrice: {
                centAmount: 100,
                currencyCode: 'CLP'
              },
              lineItemId: 'lineItem-id',
              quantity: 5
            }
          ],
          undefined
        );
      });

      it('should return a Cart response', () => {
        expect(response).toEqual({ id: 'cart-id', version: 2 });
      });
    });
  });

  describe('deleteCart', () => {
    let response: Error | Cart;

    describe('when deleteCart successfully', () => {
      beforeEach(async () => {
        response = await service.deleteCart('cart-id', 1);
      });

      it('should call CartsRepository.deleteById', () => {
        expect(mockCartsRepository.deleteById).toHaveBeenCalledWith('cart-id', { queryArgs: { version: 1 } });
      });

      it('should return a Cart response', () => {
        expect(response).toEqual({ id: 'cart-id', version: 2 });
      });
    });

    describe('when CommerceTools returns an error', () => {
      beforeEach(async () => {
        try {
          await service.deleteCart('updateById-error', 1);
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call CartsRepository.deleteById', () => {
        expect(mockCartsRepository.deleteById).toHaveBeenCalledWith('updateById-error', { queryArgs: { version: 1 } });
      });

      it('should return an Error response', () => {
        expect(response).toEqual(new Error());
      });
    });
  });

  describe('getAnonymousCart', () => {
    let response: Error | Cart;
    let spy: jest.SpyInstance;

    describe('when getAnonymousCart successfully', () => {
      beforeAll(() => {
        spy = jest.spyOn(service, 'getActiveCartByAnonymousId').mockImplementation(() => Promise.resolve(mockCommercetoolsCartWithDeliveryZoneResponse));
      });

      beforeEach(async () => {
        response = await service.getAnonymousCart('delivery-zone-id', 'anonymous-id');
      });

      it('should call service.getActiveCartByAnonymousId', () => {
        expect(spy).toHaveBeenCalledWith('anonymous-id', [
          'custom.fields.deliveryZone',
          'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount'
        ]);
      });

      it('should return a Cart response', () => {
        expect(response).toEqual(mockCommercetoolsCartWithDeliveryZoneResponse);
      });

      afterAll(() => {
        spy.mockRestore();
      });
    });

    describe('when getAnonymousCart throw BadRequestException', () => {
      beforeAll(() => {
        spy = jest.spyOn(service, 'getActiveCartByAnonymousId').mockImplementation(() => Promise.resolve(mockCommercetoolsCartWithDeliveryZoneResponse));
      });

      beforeEach(async () => {
        try {
          await service.getAnonymousCart('new-delivery-zone-id', 'anonymous-id');
        } catch (error) {
          response = error;
        }
      });

      it('should call service.getActiveCartByAnonymousId', () => {
        expect(spy).toHaveBeenCalledWith('anonymous-id', [
          'custom.fields.deliveryZone',
          'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount'
        ]);
      });

      it('should return a BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('Delivery Zone Missmatch'));
      });

      afterAll(() => {
        spy.mockRestore();
      });
    });
  });

  describe('addLineItem', () => {
    let response: Error | Cart;
    let spy: jest.SpyInstance;
    beforeAll(() => {
      spy = jest.spyOn(service, 'updateCart').mockImplementation((id: string) => Promise.resolve({ id, version: 2 } as Cart));
    });

    describe('when addLineItems succeeds', () => {
      describe('when there are line items to delete(existing line item, adding new quantity)', () => {
        beforeEach(async () => {
          mockCartsHelperService.buildLineItemActions.mockImplementation(() => [
            {
              action: 'addLineItem',
              sku: 'sku1',
              quantity: 1
            },
            {
              action: 'addLineItem',
              sku: 'sku2',
              quantity: 2
            },
            {
              action: 'removeLineItemAndSetCartCustomField',
              lineItemId: 'id-to-delete'
            }
          ]);
          response = await service.addLineItems(
            'cart-id',
            5,
            [
              { sku: 'sku1', quantity: 1 },
              { sku: 'sku2', quantity: 2 }
            ],
            ['id-to-delete']
          );
        });

        it('should call service.addLineItems', () => {
          expect(spy).toHaveBeenCalledWith(
            'cart-id',
            5,
            [
              {
                action: 'addLineItem',
                sku: 'sku1',
                quantity: 1
              },
              {
                action: 'addLineItem',
                sku: 'sku2',
                quantity: 2
              },
              {
                action: 'removeLineItemAndSetCartCustomField',
                lineItemId: 'id-to-delete'
              }
            ],
            undefined
          );
        });

        it('should return a Cart response', () => {
          expect(response).toEqual({ id: 'cart-id', version: 2 });
        });
      });

      describe('when there are no line items to delete(new line items)', () => {
        beforeEach(async () => {
          mockCartsHelperService.buildLineItemActions.mockImplementation(() => [
            {
              action: 'addLineItem',
              sku: 'sku1',
              quantity: 1
            },
            {
              action: 'addLineItem',
              sku: 'sku2',
              quantity: 2
            }
          ]);
          response = await service.addLineItems(
            'cart-id',
            5,
            [
              { sku: 'sku1', quantity: 1 },
              { sku: 'sku2', quantity: 2 }
            ],
            []
          );
        });

        it('should call service.addLineItems', () => {
          expect(spy).toHaveBeenCalledWith(
            'cart-id',
            5,
            [
              {
                action: 'addLineItem',
                sku: 'sku1',
                quantity: 1
              },
              {
                action: 'addLineItem',
                sku: 'sku2',
                quantity: 2
              }
            ],
            undefined
          );
        });

        it('should return a Cart response', () => {
          expect(response).toEqual({ id: 'cart-id', version: 2 });
        });
      });
    });
  });

  describe('getLineItem', () => {
    let response: Error | LineItem;

    describe('when get line item successfully', () => {
      beforeEach(() => {
        response = service.getLineItem(mockCommercetoolsCartWithLineItemResponse.lineItems, 'lineItem-id');
      });

      it('should return a lineItem response', () => {
        expect(response).toEqual(mockCommercetoolsCartWithLineItemResponse.lineItems[0]);
      });
    });

    describe('when line item not found', () => {
      beforeEach(() => {
        try {
          service.getLineItem([], 'lineItem-id');
        } catch (error) {
          response = error;
        }
      });

      it('should throw a NotFound error', () => {
        expect(response).toEqual(new NotFoundException('Line item not found'));
      });
    });
  });

  describe('removeAnonymousLineItem', () => {
    let response: Error | Cart;
    let spy: jest.SpyInstance;
    let spyremoveLineItemAndSetCartCustomField: jest.SpyInstance;
    let spyGetLineItem: jest.SpyInstance;

    describe('when delete line item successfully', () => {
      beforeAll(() => {
        spy = jest.spyOn(service, 'getActiveCartByAnonymousId').mockImplementation(() => Promise.resolve(mockCommercetoolsCartWithLineItemResponse));
        spyremoveLineItemAndSetCartCustomField = jest
          .spyOn(service, 'removeLineItemAndSetCartCustomField')
          .mockImplementation(() => Promise.resolve({ id: 'line-item-id', version: 2 } as Cart));
        spyGetLineItem = jest.spyOn(service, 'getLineItem').mockImplementation(() => mockCommercetoolsCartWithLineItemResponse.lineItems[0]);
      });

      beforeEach(async () => {
        response = await service.removeAnonymousLineItem('lineItem-id', 'anonymous-id');
      });

      it('should call service.getActiveCartByAnonymousId', () => {
        expect(spy).toHaveBeenCalledWith('anonymous-id', [
          'custom.fields.deliveryZone',
          'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount'
        ]);
      });

      it('should call service.getLineItem', () => {
        expect(spyGetLineItem).toHaveBeenCalledWith(mockCommercetoolsCartWithLineItemResponse.lineItems, 'lineItem-id');
      });

      it('should call service.removeLineItemAndSetCartCustomField', () => {
        expect(spyremoveLineItemAndSetCartCustomField).toHaveBeenCalledWith('c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', 'lineItem-id', 1, undefined, undefined, {
          expand: ['custom.fields.deliveryZone', 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount']
        });
      });

      it('should return a Cart response', () => {
        expect(response).toEqual({ id: 'line-item-id', version: 2 });
      });
    });

    afterAll(() => {
      spy.mockRestore();
    });
  });

  describe('updateAnonymousLineItemQuantity', () => {
    let response: Error | Cart;
    let spy: jest.SpyInstance;
    let spyUpdateLineItemQuantity: jest.SpyInstance;
    let spyGetLineItem: jest.SpyInstance;

    describe('when update line item successfully', () => {
      beforeAll(() => {
        spy = jest.spyOn(service, 'getActiveCartByAnonymousId').mockImplementation(() => Promise.resolve(mockCommercetoolsCartWithLineItemAndDeliveryZoneCustomFieldResponse));
        spyUpdateLineItemQuantity = jest.spyOn(service, 'updateLineItemQuantity').mockImplementation(() => Promise.resolve({ id: 'line-item-id', version: 2 } as Cart));
        spyGetLineItem = jest.spyOn(service, 'getLineItem').mockImplementation(() => mockCommercetoolsCartWithLineItemResponse.lineItems[0]);
      });

      beforeEach(async () => {
        response = await service.updateAnonymousLineItemQuantity('lineItem-id', 5, 'anonymous-id');
      });

      it('should call service.getActiveCartByAnonymousId', () => {
        expect(spy).toHaveBeenCalledWith('anonymous-id', [
          'custom.fields.deliveryZone',
          'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount'
        ]);
      });

      it('should call service.getLineItem', () => {
        expect(spyGetLineItem).toHaveBeenCalledWith(mockCommercetoolsCartWithLineItemResponse.lineItems, 'lineItem-id');
      });

      it('should call service.updateLineItemQuantity', () => {
        expect(spyUpdateLineItemQuantity).toHaveBeenCalledWith(5, 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', mockCommercetoolsCartWithLineItemResponse.lineItems[0], 1, {
          expand: ['custom.fields.deliveryZone', 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount']
        });
      });

      it('should return a Cart response', () => {
        expect(response).toEqual({ id: 'line-item-id', version: 2 });
      });
    });
  });

  describe('createAnonymous', () => {
    let response: Cart;

    describe('when create a cart successfully', () => {
      const cartDraft: Partial<CartDraft> = {
        lineItems: [
          {
            sku: 'sku'
          }
        ]
      };
      beforeEach(async () => {
        response = await service.createAnonymous(cartDraft, 'anonymous-id', 'deliveryZoneId');
      });

      it('should call cartRepository.create', () => {
        expect(mockCartsRepository.create).toHaveBeenCalledWith({
          body: {
            anonymousId: 'anonymous-id',
            currency: 'CLP',
            inventoryMode: 'ReserveOnOrder',
            custom: {
              fields: {
                uniqueSkuCount: 1,
                createdBy: 'anonymous-id',
                deliveryZone: {
                  id: 'deliveryZoneId',
                  typeId: 'key-value-document'
                },
                source: ECOMM_SOURCE_CUSTOM_FIELD
              },
              type: {
                key: 'adelco-cart-type',
                typeId: 'type'
              }
            },
            lineItems: [{ sku: 'sku' }],
            taxMode: 'External'
          },
          queryArgs: undefined
        });
      });

      it('should return a Cart reponse', () => {
        expect(response).toEqual({
          anonymousId: 'anonymous-id',
          currency: 'CLP',
          id: 'id',
          inventoryMode: 'ReserveOnOrder',
          lineItems: [{ sku: 'sku' }],
          taxMode: 'External',
          version: 1,
          custom: {
            fields: {
              uniqueSkuCount: 1,
              createdBy: 'anonymous-id',
              deliveryZone: {
                id: 'deliveryZoneId',
                typeId: 'key-value-document'
              },
              source: ECOMM_SOURCE_CUSTOM_FIELD
            },
            type: {
              key: 'adelco-cart-type',
              typeId: 'type'
            }
          }
        });
      });
    });
  });

  describe('addAnonymousLineItems', () => {
    let response: Cart | Error;
    let spyGetActiveCart: jest.SpyInstance;
    let spyAddLineItems: jest.SpyInstance;
    let spyCreateAnonymous: jest.SpyInstance;

    describe('when add line items successfully', () => {
      const lineItemDraft: LineItemDraft = {
        sku: 'sku'
      };

      describe('when exist a cart', () => {
        beforeEach(async () => {
          spyGetActiveCart = jest
            .spyOn(service, 'getActiveCartByAnonymousId')
            .mockImplementation(async () => Promise.resolve(mockCommercetoolsCartWithLineItemAndDeliveryZoneCustomFieldResponse));
          spyAddLineItems = jest.spyOn(service, 'addLineItems').mockImplementation(async () => Promise.resolve({ id: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', version: 2 } as Cart));
          response = await service.addAnonymousLineItems(lineItemDraft, 'delivery-zone-id', 'anonymous-id');
        });

        it('should call getActiveCartByAnonymousId', () => {
          expect(spyGetActiveCart).toHaveBeenCalledWith('anonymous-id', [
            'custom.fields.deliveryZone',
            'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount'
          ]);
        });

        it('should not call DeliveryZonesService.getById', () => {
          expect(mockDeliveryZonesService.getById).not.toHaveBeenCalled();
        });

        it('should call CartsHelperService.getDefaultDistributionChannelForDeliveryZone', () => {
          expect(mockCartsHelperService.getDefaultDistributionChannelForDeliveryZone).toHaveBeenCalledWith([{ key: 'deliveryZoneKey', value: { dcCode: 'dcCode' } }]);
        });

        it('should call addLineItems', () => {
          expect(spyAddLineItems).toHaveBeenCalledWith('c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', 1, [{ sku: 'sku' }], [], {
            expand: ['custom.fields.deliveryZone', 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount']
          });
        });

        it('should return a Cart response', () => {
          expect(response).toEqual({ id: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', version: 2 });
        });

        afterAll(() => {
          spyGetActiveCart.mockRestore();
        });
      });

      describe('when not exist a cart', () => {
        beforeEach(async () => {
          spyGetActiveCart = jest.spyOn(service, 'getActiveCartByAnonymousId').mockImplementation(async () => {
            throw new Error('Invalid');
          });
          spyCreateAnonymous = jest
            .spyOn(service, 'createAnonymous')
            .mockImplementation(async () => Promise.resolve({ id: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', version: 2 } as Cart));
          response = await service.addAnonymousLineItems(lineItemDraft, 'delivery-zone-id', 'anonymous-id');
        });

        it('should call getActiveCartByAnonymousId', () => {
          expect(spyGetActiveCart).toHaveBeenCalledWith('anonymous-id', [
            'custom.fields.deliveryZone',
            'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount'
          ]);
        });

        it('should call DeliveryZonesService.getById', () => {
          expect(mockDeliveryZonesService.getById).toHaveBeenCalledWith('delivery-zone-id');
        });

        it('should call CartsHelperService.getDefaultDistributionChannelForDeliveryZone', () => {
          expect(mockCartsHelperService.getDefaultDistributionChannelForDeliveryZone).toHaveBeenCalledWith([mockDeliveryZonesResponse]);
        });

        it('should call createAnonymous', () => {
          expect(spyCreateAnonymous).toHaveBeenCalledWith({ lineItems: [{ sku: 'sku' }] }, 'anonymous-id', 'delivery-zone-id', {
            expand: ['custom.fields.deliveryZone', 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount']
          });
        });

        it('should return a Cart response', () => {
          expect(response).toEqual({ id: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b', version: 2 });
        });

        afterAll(() => {
          spyGetActiveCart.mockRestore();
        });
      });
    });
  });

  describe('contactRequest', () => {
    let spyGetActiveCart: jest.SpyInstance<Promise<Cart>>;
    const mockBody: OrderContactRequestDto = {
      username: 'email@email.com',
      rut: 'rut',
      firstName: 'firstName',
      lastName: 'lastName',
      phone: 'phone',
      tradeName: 'tradeName',
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
    } as OrderContactRequestDto;
    const mockAnonymouId = 'anonymou-id';

    describe('when success', () => {
      describe('when exist a business unit for the RUT and send the email for adelco csr', () => {
        beforeEach(async () => {
          spyGetActiveCart = jest.spyOn(service, 'getActiveCartByAnonymousId').mockResolvedValueOnce(mockCommercetoolsCartWithDeliveryZoneResponse);
          await service.orderContactRequest(mockAnonymouId, mockBody);
        });

        it('Should call getActiveCartByAnonymousId method', () => {
          expect(spyGetActiveCart).toHaveBeenCalledWith(mockAnonymouId);
        });

        it('should log the OrderContactRequest', () => {
          expect(mockLoggerService.log).toBeCalledWith(`[Cart ID]: c3d864a1-577c-4a11-bd94-d32f8bc5ff2b and orderContact ${JSON.stringify(mockBody)}`);
        });

        it('should log the BusinessUnitService.findByRut', () => {
          expect(mockBusinessUnitsService.findByRut).toBeCalledWith(mockBody.rut);
        });

        it('should send notification', () => {
          expect(mockNotificationsService.sendNotification).toBeCalledWith(
            {
              notificationType: 'ORDER_CONTACT_REQUEST',
              templateData: {
                cartId: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
                client: {
                  buKey: 'key',
                  commune: 'commune',
                  email: 'email@email.com',
                  name: 'firstName lastName',
                  phone: 'phone',
                  region: 'region',
                  rut: 'rut',
                  streetName: 'streetName',
                  streetNumber: 'streetNumber'
                },
                billingAddress: {
                  commune: 'commune',
                  region: 'region',
                  streetName: 'streetName',
                  streetNumber: 'streetNumber'
                },
                discounts: '$0',
                items: [],
                requestDate: '2023-12-31',
                requestTime: '21:00:00',
                subTotal: '$0',
                taxes: '$0',
                totalAmount: '$0'
              },
              to: [{ email: 'adelcoCsr@adelco.com', name: 'n/a' }]
            },
            MAIL_NOTIFICATION_TOPIC
          );
        });

        afterAll(() => {
          spyGetActiveCart.mockRestore();
        });
      });

      describe('when not exist a business unit for the RUT but exist the customer in other BU, create fake BU and send the email for adelco csr', () => {
        beforeEach(async () => {
          spyGetActiveCart = jest.spyOn(service, 'getActiveCartByAnonymousId').mockResolvedValueOnce(mockCommercetoolsCartWithDeliveryZoneResponse);
          await service.orderContactRequest(mockAnonymouId, { ...mockBody, rut: 'no-bu' });
        });

        it('Should call getActiveCartByAnonymousId method', () => {
          expect(spyGetActiveCart).toHaveBeenCalledWith(mockAnonymouId);
        });

        it('should log the OrderContactRequest', () => {
          expect(mockLoggerService.log).toBeCalledWith(`[Cart ID]: c3d864a1-577c-4a11-bd94-d32f8bc5ff2b and orderContact ${JSON.stringify({ ...mockBody, rut: 'no-bu' })}`);
        });

        it('should log the BusinessUnitService.findByRut', () => {
          expect(mockBusinessUnitsService.findByRut).toBeCalledWith('no-bu');
        });

        it('should log the CustomerService.getCustomerByEmail', () => {
          expect(mockCustomersService.getCustomerByEmail).toBeCalledWith('email@email.com');
        });

        it('should log the BusinessUnitService.findBusinessUnitByAssociateId', () => {
          expect(mockBusinessUnitsService.findBusinessUnitByAssociateId).toBeCalledWith('id');
        });

        it('should log the BusinessUnitService.repRegistration', () => {
          expect(mockBusinessUnitsService.repRegistration).toBeCalledWith(
            {
              address: {
                apartment: 'apartment',
                city: 'city',
                commune: 'commune',
                coordinates: { lat: 1, long: 1 },
                country: 'CL',
                otherInformation: 'otherInformation',
                region: 'region',
                streetName: 'streetName',
                streetNumber: 'streetNumber'
              },
              billingAddress: {
                apartment: 'apartment',
                city: 'city',
                commune: 'commune',
                coordinates: { lat: 1, long: 1 },
                country: 'CL',
                otherInformation: 'otherInformation',
                region: 'region',
                streetName: 'streetName',
                streetNumber: 'streetNumber'
              },
              tradeName: 'tradeName',
              username: undefined,
              firstName: 'firstName',
              lastName: 'lastName',
              phone: 'phone',
              rut: 'no-bu'
            },
            true
          );
        });

        it('should send notification', () => {
          expect(mockNotificationsService.sendNotification).toBeCalledWith(
            {
              notificationType: 'ORDER_CONTACT_REQUEST',
              templateData: {
                cartId: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
                client: {
                  buKey: 'key',
                  commune: 'commune',
                  email: 'email@email.com',
                  name: 'firstName lastName',
                  phone: 'phone',
                  region: 'region',
                  rut: 'no-bu',
                  streetName: 'streetName',
                  streetNumber: 'streetNumber'
                },
                billingAddress: {
                  commune: 'commune',
                  region: 'region',
                  streetName: 'streetName',
                  streetNumber: 'streetNumber'
                },
                discounts: '$0',
                items: [],
                requestDate: '2023-12-31',
                requestTime: '21:00:00',
                subTotal: '$0',
                taxes: '$0',
                totalAmount: '$0'
              },
              to: [{ email: 'adelcoCsr@adelco.com', name: 'n/a' }]
            },
            MAIL_NOTIFICATION_TOPIC
          );
        });

        afterAll(() => {
          spyGetActiveCart.mockRestore();
        });
      });

      describe('when not exist a business unit for the RUT, not exist the customer and send the email for adelco csr', () => {
        beforeEach(async () => {
          spyGetActiveCart = jest.spyOn(service, 'getActiveCartByAnonymousId').mockResolvedValueOnce(mockCommercetoolsCartWithDeliveryZoneResponse);
          await service.orderContactRequest(mockAnonymouId, { ...mockBody, rut: 'no-bu', username: 'nocustomer@adelco.com' });
        });

        it('Should call getActiveCartByAnonymousId method', () => {
          expect(spyGetActiveCart).toHaveBeenCalledWith(mockAnonymouId);
        });

        it('should log the OrderContactRequest', () => {
          expect(mockLoggerService.log).toBeCalledWith(
            `[Cart ID]: c3d864a1-577c-4a11-bd94-d32f8bc5ff2b and orderContact ${JSON.stringify({ ...mockBody, rut: 'no-bu', username: 'nocustomer@adelco.com' })}`
          );
        });

        it('should log the BusinessUnitService.findByRut', () => {
          expect(mockBusinessUnitsService.findByRut).toBeCalledWith('no-bu');
        });

        it('should log the CustomerService.getCustomerByEmail', () => {
          expect(mockCustomersService.getCustomerByEmail).toBeCalledWith('nocustomer@adelco.com');
        });

        it('should log the BusinessUnitService.findBusinessUnitByAssociateId', () => {
          expect(mockBusinessUnitsService.findBusinessUnitByAssociateId).toBeCalledWith(undefined);
        });

        it('should log the BusinessUnitService.repRegistration', () => {
          expect(mockBusinessUnitsService.repRegistration).toBeCalledWith(
            {
              address: {
                apartment: 'apartment',
                city: 'city',
                commune: 'commune',
                coordinates: { lat: 1, long: 1 },
                country: 'CL',
                otherInformation: 'otherInformation',
                region: 'region',
                streetName: 'streetName',
                streetNumber: 'streetNumber'
              },
              billingAddress: {
                apartment: 'apartment',
                city: 'city',
                commune: 'commune',
                coordinates: { lat: 1, long: 1 },
                country: 'CL',
                otherInformation: 'otherInformation',
                region: 'region',
                streetName: 'streetName',
                streetNumber: 'streetNumber'
              },
              tradeName: 'tradeName',
              firstName: 'firstName',
              lastName: 'lastName',
              phone: 'phone',
              rut: 'no-bu',
              username: 'nocustomer@adelco.com'
            },
            false
          );
        });

        it('should send notification', () => {
          expect(mockNotificationsService.sendNotification).toBeCalledWith(
            {
              notificationType: 'ORDER_CONTACT_REQUEST',
              templateData: {
                cartId: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
                client: {
                  buKey: 'key',
                  commune: 'commune',
                  email: 'nocustomer@adelco.com',
                  name: 'firstName lastName',
                  phone: 'phone',
                  region: 'region',
                  rut: 'no-bu',
                  streetName: 'streetName',
                  streetNumber: 'streetNumber'
                },
                billingAddress: {
                  commune: 'commune',
                  region: 'region',
                  streetName: 'streetName',
                  streetNumber: 'streetNumber'
                },
                discounts: '$0',
                items: [],
                requestDate: '2023-12-31',
                requestTime: '21:00:00',
                subTotal: '$0',
                taxes: '$0',
                totalAmount: '$0'
              },
              to: [{ email: 'adelcoCsr@adelco.com', name: 'n/a' }]
            },
            MAIL_NOTIFICATION_TOPIC
          );
        });

        afterAll(() => {
          spyGetActiveCart.mockRestore();
        });
      });

      describe('when not exist a business unit for the RUT, not send username and send the email for adelco csr', () => {
        beforeEach(async () => {
          spyGetActiveCart = jest.spyOn(service, 'getActiveCartByAnonymousId').mockResolvedValueOnce(mockCommercetoolsCartWithDeliveryZoneResponse);
          await service.orderContactRequest(mockAnonymouId, { ...mockBody, rut: 'no-bu', username: undefined });
        });

        it('Should call getActiveCartByAnonymousId method', () => {
          expect(spyGetActiveCart).toHaveBeenCalledWith(mockAnonymouId);
        });

        it('should log the OrderContactRequest', () => {
          expect(mockLoggerService.log).toBeCalledWith(
            `[Cart ID]: c3d864a1-577c-4a11-bd94-d32f8bc5ff2b and orderContact ${JSON.stringify({ ...mockBody, rut: 'no-bu', username: undefined })}`
          );
        });

        it('should log the BusinessUnitService.findByRut', () => {
          expect(mockBusinessUnitsService.findByRut).toBeCalledWith('no-bu');
        });

        it('should not call CustomerService.getCustomerByEmail', () => {
          expect(mockCustomersService.getCustomerByEmail).not.toHaveBeenCalled();
        });

        it('should not call BusinessUnitService.findBusinessUnitByAssociateId', () => {
          expect(mockBusinessUnitsService.findBusinessUnitByAssociateId).not.toHaveBeenCalled();
        });

        it('should log the BusinessUnitService.repRegistration', () => {
          expect(mockBusinessUnitsService.repRegistration).toBeCalledWith(
            {
              address: {
                apartment: 'apartment',
                city: 'city',
                commune: 'commune',
                coordinates: { lat: 1, long: 1 },
                country: 'CL',
                otherInformation: 'otherInformation',
                region: 'region',
                streetName: 'streetName',
                streetNumber: 'streetNumber'
              },
              billingAddress: {
                apartment: 'apartment',
                city: 'city',
                commune: 'commune',
                coordinates: { lat: 1, long: 1 },
                country: 'CL',
                otherInformation: 'otherInformation',
                region: 'region',
                streetName: 'streetName',
                streetNumber: 'streetNumber'
              },
              tradeName: 'tradeName',
              firstName: 'firstName',
              lastName: 'lastName',
              phone: 'phone',
              rut: 'no-bu'
            },
            true
          );
        });

        it('should send notification', () => {
          expect(mockNotificationsService.sendNotification).toBeCalledWith(
            {
              notificationType: 'ORDER_CONTACT_REQUEST',
              templateData: {
                cartId: 'c3d864a1-577c-4a11-bd94-d32f8bc5ff2b',
                client: {
                  buKey: 'key',
                  commune: 'commune',
                  email: undefined,
                  name: 'firstName lastName',
                  phone: 'phone',
                  region: 'region',
                  rut: 'no-bu',
                  streetName: 'streetName',
                  streetNumber: 'streetNumber'
                },
                billingAddress: {
                  commune: 'commune',
                  region: 'region',
                  streetName: 'streetName',
                  streetNumber: 'streetNumber'
                },
                discounts: '$0',
                items: [],
                requestDate: '2023-12-31',
                requestTime: '21:00:00',
                subTotal: '$0',
                taxes: '$0',
                totalAmount: '$0'
              },
              to: [{ email: 'adelcoCsr@adelco.com', name: 'n/a' }]
            },
            MAIL_NOTIFICATION_TOPIC
          );
        });

        afterAll(() => {
          spyGetActiveCart.mockRestore();
        });
      });
    });
  });

  describe('getActiveCartById', () => {
    describe('when its not an anonymous cart', () => {
      it('should return an active cart', async () => {
        mockCartsRepository.find.mockImplementation(() => Promise.resolve({ results: [mockCommercetoolsCartResponse] }));
        const response = await service.getActiveCartById('cartId', false);
        expect(mockCartsRepository.find).toHaveBeenCalledWith({ queryArgs: { limit: 1, where: ['id="cartId"', 'cartState="Active"'] } });
        expect(response).toEqual(mockCommercetoolsCartResponse);
      });

      it('should throw an error if not exists ', async () => {
        mockCartsRepository.find.mockImplementation(() => Promise.resolve({ results: [] }));
        await expect(service.getActiveCartById('cartId', false)).rejects.toThrow();
      });
    });

    describe('when its an anonymous cart', () => {
      it('should return an active anonymous cart', async () => {
        mockCartsRepository.find.mockImplementation(() => Promise.resolve({ results: [mockCommercetoolsCartResponse] }));
        const response = await service.getActiveCartById('cartId', true);
        expect(mockCartsRepository.find).toHaveBeenCalledWith({ queryArgs: { limit: 1, where: ['id="cartId"', 'cartState="Active"', 'anonymousId is defined'] } });
        expect(response).toEqual(mockCommercetoolsCartResponse);
      });

      it('should throw an error if not exists ', async () => {
        mockCartsRepository.find.mockImplementation(() => Promise.resolve({ results: [] }));
        await expect(service.getActiveCartById('cartId', true)).rejects.toThrow();
      });
    });
  });
});
