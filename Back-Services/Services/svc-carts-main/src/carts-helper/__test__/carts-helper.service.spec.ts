const mockDeliveryZonesService = {
  getAndValidateDeliveryZone: jest.fn().mockImplementation(() => {
    return {
      dcCode: 'dcCode',
      t2Rate: 't2Rate'
    };
  })
};

jest.mock('@/delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZonesService)
}));

const mockProductsService = {
  getProductBySku: jest.fn().mockImplementation(),
  findAllProducts: jest.fn()
};

jest.mock('@/products/products.service', () => ({
  ProductsService: jest.fn().mockImplementation(() => mockProductsService)
}));

const mockChannelsService = {
  getSupplyChannels: jest.fn().mockImplementation(() => Promise.resolve(supplyChannelsMock)),
  getDefaultChannelForDistributionCenter: jest.fn().mockImplementation((dcCode: string) => {
    switch (dcCode) {
      case 'notFoundDcCode':
        return Promise.resolve(undefined);
      default:
        return Promise.resolve({
          id: 'channelId',
          key: 'key',
          roles: ['ProductDistribution'],
          distributionCenter: 'dcCode',
          salesChannel: '1'
        });
    }
  })
};

jest.mock('@/channels/channels.service', () => ({
  ChannelsService: jest.fn().mockImplementation(() => mockChannelsService)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'cartsHelper.priceCurrency':
        return 'CLP';
      case 'cartsHelper.salesCartVerificationTimeMinutes':
        return 300;
      case 'cartsHelper.ecommerceCartVerificationTimeMinutes':
        return 600;
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

const mockPriceCalculation = jest.fn();

jest.mock('@adelco/price-calc', () => ({
  calculatePriceForCTCart: mockPriceCalculation
}));

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

import { Test, TestingModule } from '@nestjs/testing';
import { CartsHelperService } from '../carts-helper.service';
import { ProductsService } from '@/products/products.service';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { IGetProductsDraftAndLineItemsIdsToDeleteResponse } from '../carts-helper.interface';
import { mockCommercetoolsCartResponse, mockCommercetoolsCartWithLineItemVariantAndCustomFieldsResponse, mockLineItem, mockLineItemsDraft } from '@/carts/__mock__/carts.mock';
import { Cart, CartAddLineItemAction, CartRemoveLineItemAction, CartUpdateAction, Channel, LineItem, LineItemDraft, ProductVariant } from '@commercetools/platform-sdk';
import {
  mockBaseProduct,
  mockPriceForCTCart,
  mockProductProjection,
  mockProductWithLessStock,
  mockProductWithoutStock,
  mockProductsBySkus
} from '@/products/__mocks__/products.mock';
import * as priceCalculation from '@adelco/price-calc';
import { BadRequestException } from '@nestjs/common';
import { ChannelsService } from '@/channels/channels.service';
import { ConfigService } from '@nestjs/config';
import { supplyChannelsMock } from '@/channels/__mocks__/channels.mock';
import { ApiError } from '@/common/errors/api.error';
import { mockCommercetoolsCartWithLastVerificationTimeResponse } from '../__mock__/carts.mock';

describe('CartsHelperService', () => {
  let service: CartsHelperService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartsHelperService, ProductsService, DeliveryZonesService, ChannelsService, ConfigService]
    }).compile();

    service = module.get<CartsHelperService>(CartsHelperService);
  });

  describe('getProductsDraftAndLineItemsIdsToDelete', () => {
    let response: IGetProductsDraftAndLineItemsIdsToDeleteResponse;

    describe('when get products draft and line items ids to delete and is sync cart', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        mockProductsService.findAllProducts.mockResolvedValue([{ masterVariant: { sku: 'sku' } }]);
        spy = jest.spyOn(service, 'getProductForCart').mockImplementation(() => ({ sku: 'sku' }));
        response = await service.getProductsDraftAndLineItemsIdsToDelete({
          lineItemsDraft: [{ sku: 'sku1', quantity: 1 }],
          cart: { ...mockCommercetoolsCartResponse, lineItems: [mockLineItem as LineItem] },
          distributionChannelId: 'distributionChannelId',
          taxProfile: '1',
          isSyncCart: true,
          dcCode: 'dcCode',
          t2Rate: 't2Rate'
        });
      });

      afterAll(() => {
        spy.mockRestore();
      });

      it('should call ProductsService.findAllProducts', () => {
        expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(['sku1'], 'dcCode', 'distributionChannelId');
      });

      it('should call CartsHelperService.getProductForCart', () => {
        expect(spy).toHaveBeenCalledWith({
          dcCode: 'dcCode',
          isSyncCart: true,
          newQuantity: 1,
          oldQuantity: undefined,
          shouldApplyT2Rate: undefined,
          sku: 'sku1',
          t2Rate: 't2Rate',
          taxProfile: '1',
          supplyChannels: supplyChannelsMock,
          products: [{ masterVariant: { sku: 'sku' } }],
          distributionChannelId: 'distributionChannelId'
        });
      });

      it('should return lineItemsIdsToDelete and productsDraft', () => {
        expect(response).toEqual({
          lineItemsIdsToDelete: ['4bcdaaf2-6d5a-4377-9a70-77fc3e4bf428'],
          productsDraft: [{ sku: 'sku' }],
          isPriceUpdated: false,
          isQuantityUpdated: false
        });
      });
    });

    describe('when the stock is less than new quantity and is sync cart', () => {
      let spy: jest.SpyInstance;
      beforeEach(async () => {
        mockProductsService.findAllProducts.mockResolvedValue([
          {
            masterVariant: {
              sku: 'sku1',
              availability: {
                channels: {
                  'with-less-stock-id': { availableQuantity: 3 }
                }
              }
            },
            variants: []
          }
        ]);
        spy = jest.spyOn(service, 'getProductForCart').mockImplementation(() => ({ sku: 'sku1', externalPrice: { centAmount: 1000, currencyCode: 'CLP' } }));
      });

      afterAll(() => {
        spy.mockRestore();
      });

      describe('when lineItem quantity changes', () => {
        beforeEach(async () => {
          response = await service.getProductsDraftAndLineItemsIdsToDelete({
            lineItemsDraft: [{ sku: 'sku1', quantity: 5 }],
            cart: {
              ...mockCommercetoolsCartResponse,
              lineItems: [
                {
                  ...mockLineItem,
                  variant: {
                    ...mockLineItem.variant,
                    sku: 'sku1'
                  },
                  supplyChannel: {
                    typeId: 'channel',
                    id: 'with-less-stock-id'
                  },
                  price: {
                    id: 'price-id',
                    value: {
                      centAmount: 1000,
                      currencyCode: 'CLP',
                      type: 'centPrecision',
                      fractionDigits: 0
                    }
                  }
                } as LineItem
              ]
            },
            distributionChannelId: 'distributionChannelId',
            taxProfile: '1',
            isSyncCart: true,
            dcCode: 'dcCode',
            t2Rate: 't2Rate',
            isUpdateLastVerificationTime: true
          });
        });

        it('should call ProductsService.findAllProducts', () => {
          expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(['sku1'], 'dcCode', 'distributionChannelId');
        });

        it('should call CartsHelperService.getProductForCart', () => {
          expect(spy).toHaveBeenCalledWith({
            dcCode: 'dcCode',
            isSyncCart: true,
            newQuantity: 5,
            oldQuantity: 1,
            shouldApplyT2Rate: undefined,
            sku: 'sku1',
            t2Rate: 't2Rate',
            taxProfile: '1',
            supplyChannels: supplyChannelsMock,
            products: [
              {
                masterVariant: {
                  sku: 'sku1',
                  availability: {
                    channels: {
                      'with-less-stock-id': { availableQuantity: 3 }
                    }
                  }
                },
                variants: []
              }
            ],
            distributionChannelId: 'distributionChannelId'
          });
        });
      });

      describe('when lineItem quantity doesn`t change', () => {
        beforeEach(async () => {
          response = await service.getProductsDraftAndLineItemsIdsToDelete({
            lineItemsDraft: [{ sku: 'sku1', quantity: 5 }],
            cart: {
              ...mockCommercetoolsCartResponse,
              lineItems: [
                {
                  ...mockLineItem,
                  quantity: 5,
                  variant: {
                    ...mockLineItem.variant,
                    sku: 'sku1'
                  },
                  supplyChannel: {
                    typeId: 'channel',
                    id: 'with-less-stock-id'
                  },
                  price: {
                    id: 'price-id',
                    value: {
                      centAmount: 1000,
                      currencyCode: 'CLP',
                      type: 'centPrecision',
                      fractionDigits: 0
                    }
                  }
                } as LineItem
              ]
            },
            distributionChannelId: 'distributionChannelId',
            taxProfile: '1',
            isSyncCart: true,
            dcCode: 'dcCode',
            t2Rate: 't2Rate',
            isUpdateLastVerificationTime: true
          });
        });

        it('should call ProductsService.findAllProducts', () => {
          expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(['sku1'], 'dcCode', 'distributionChannelId');
        });

        it('should call CartsHelperService.getProductForCart', () => {
          expect(spy).toHaveBeenCalledWith({
            dcCode: 'dcCode',
            isSyncCart: true,
            newQuantity: 3,
            oldQuantity: 5,
            shouldApplyT2Rate: undefined,
            sku: 'sku1',
            t2Rate: 't2Rate',
            taxProfile: '1',
            supplyChannels: supplyChannelsMock,
            products: [
              {
                masterVariant: {
                  sku: 'sku1',
                  availability: {
                    channels: {
                      'with-less-stock-id': { availableQuantity: 3 }
                    }
                  }
                },
                variants: []
              }
            ],
            distributionChannelId: 'distributionChannelId'
          });
        });

        it('should return lineItemsIdsToDelete and productsDraft', () => {
          expect(response).toEqual({
            lineItemsIdsToDelete: ['4bcdaaf2-6d5a-4377-9a70-77fc3e4bf428'],
            productsDraft: [{ sku: 'sku1', externalPrice: { centAmount: 1000, currencyCode: 'CLP' } }],
            isPriceUpdated: false,
            isQuantityUpdated: true
          });
        });
      });
    });

    describe('when the stock is zero and is sync cart', () => {
      let spy: jest.SpyInstance;
      beforeEach(async () => {
        mockProductsService.findAllProducts.mockResolvedValue([
          {
            masterVariant: {
              sku: 'sku1',
              availability: {
                channels: {
                  'with-less-stock-id': { availableQuantity: 0 }
                }
              }
            },
            variants: []
          }
        ]);
        spy = jest.spyOn(service, 'getProductForCart').mockImplementation(() => ({ sku: 'sku1', externalPrice: { centAmount: 1000, currencyCode: 'CLP' } }));
      });

      afterAll(() => {
        spy.mockRestore();
      });

      describe('when lineItem quantity changes', () => {
        beforeEach(async () => {
          response = await service.getProductsDraftAndLineItemsIdsToDelete({
            lineItemsDraft: [{ sku: 'sku1', quantity: 5 }],
            cart: {
              ...mockCommercetoolsCartResponse,
              lineItems: [
                {
                  ...mockLineItem,
                  variant: {
                    ...mockLineItem.variant,
                    sku: 'sku1'
                  },
                  supplyChannel: {
                    typeId: 'channel',
                    id: 'with-less-stock-id'
                  },
                  price: {
                    id: 'price-id',
                    value: {
                      centAmount: 1000,
                      currencyCode: 'CLP',
                      type: 'centPrecision',
                      fractionDigits: 0
                    }
                  }
                } as LineItem
              ]
            },
            distributionChannelId: 'distributionChannelId',
            taxProfile: '1',
            isSyncCart: true,
            dcCode: 'dcCode',
            t2Rate: 't2Rate',
            isUpdateLastVerificationTime: true
          });
        });

        it('should call ProductsService.findAllProducts', () => {
          expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(['sku1'], 'dcCode', 'distributionChannelId');
        });

        it('should call CartsHelperService.getProductForCart', () => {
          expect(spy).toHaveBeenCalledWith({
            dcCode: 'dcCode',
            isSyncCart: true,
            newQuantity: 5,
            oldQuantity: 1,
            shouldApplyT2Rate: undefined,
            sku: 'sku1',
            t2Rate: 't2Rate',
            taxProfile: '1',
            supplyChannels: supplyChannelsMock,
            products: [
              {
                masterVariant: {
                  sku: 'sku1',
                  availability: {
                    channels: {
                      'with-less-stock-id': { availableQuantity: 0 }
                    }
                  }
                },
                variants: []
              }
            ],
            distributionChannelId: 'distributionChannelId'
          });
        });
      });

      describe('when lineItem quantity doesn`t change', () => {
        beforeEach(async () => {
          response = await service.getProductsDraftAndLineItemsIdsToDelete({
            lineItemsDraft: [{ sku: 'sku1', quantity: 1 }],
            cart: {
              ...mockCommercetoolsCartResponse,
              lineItems: [
                {
                  ...mockLineItem,
                  variant: {
                    ...mockLineItem.variant,
                    sku: 'sku1'
                  },
                  supplyChannel: {
                    typeId: 'channel',
                    id: 'with-less-stock-id'
                  },
                  price: {
                    id: 'price-id',
                    value: {
                      centAmount: 1000,
                      currencyCode: 'CLP',
                      type: 'centPrecision',
                      fractionDigits: 0
                    }
                  }
                } as LineItem
              ]
            },
            distributionChannelId: 'distributionChannelId',
            taxProfile: '1',
            isSyncCart: true,
            dcCode: 'dcCode',
            t2Rate: 't2Rate',
            isUpdateLastVerificationTime: true
          });
        });

        it('should call ProductsService.findAllProducts', () => {
          expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(['sku1'], 'dcCode', 'distributionChannelId');
        });

        it('should not call CartsHelperService.getProductForCart', () => {
          expect(spy).not.toHaveBeenCalledWith({
            dcCode: 'dcCode',
            isSyncCart: true,
            newQuantity: 1,
            oldQuantity: 1,
            shouldApplyT2Rate: undefined,
            sku: 'sku1',
            t2Rate: 't2Rate',
            taxProfile: '1',
            supplyChannels: supplyChannelsMock,
            products: [
              {
                masterVariant: {
                  sku: 'sku1',
                  availability: {
                    channels: {
                      'with-less-stock-id': { availableQuantity: 3 }
                    }
                  }
                },
                variants: []
              }
            ],
            distributionChannelId: 'distributionChannelId'
          });
        });

        it('should return lineItemsIdsToDelete and productsDraft', () => {
          expect(response).toEqual({
            lineItemsIdsToDelete: ['4bcdaaf2-6d5a-4377-9a70-77fc3e4bf428'],
            productsDraft: [],
            isPriceUpdated: false,
            isQuantityUpdated: true
          });
        });
      });
    });

    describe('when the price has changed and is sync cart', () => {
      let spy: jest.SpyInstance;
      beforeEach(async () => {
        mockProductsService.findAllProducts.mockResolvedValue([
          {
            masterVariant: {
              sku: 'sku1',
              availability: {
                channels: {
                  'with-less-stock-id': { availableQuantity: 100 }
                }
              }
            },
            variants: []
          }
        ]);
        spy = jest.spyOn(service, 'getProductForCart').mockImplementation(() => ({ sku: 'sku1', externalPrice: { centAmount: 2000, currencyCode: 'CLP' } }));

        response = await service.getProductsDraftAndLineItemsIdsToDelete({
          lineItemsDraft: [{ sku: 'sku1', quantity: 5 }],
          cart: {
            ...mockCommercetoolsCartResponse,
            lineItems: [
              {
                ...mockLineItem,
                variant: {
                  ...mockLineItem.variant,
                  sku: 'sku1'
                },
                supplyChannel: {
                  typeId: 'channel',
                  id: 'with-less-stock-id'
                },
                price: {
                  id: 'price-id',
                  value: {
                    centAmount: 1000,
                    currencyCode: 'CLP',
                    type: 'centPrecision',
                    fractionDigits: 0
                  }
                }
              } as LineItem
            ]
          },
          distributionChannelId: 'distributionChannelId',
          taxProfile: '1',
          isSyncCart: true,
          dcCode: 'dcCode',
          t2Rate: 't2Rate',
          isUpdateLastVerificationTime: true
        });
      });

      afterAll(() => {
        spy.mockRestore();
      });

      it('should call ProductsService.findAllProducts', () => {
        expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(['sku1'], 'dcCode', 'distributionChannelId');
      });

      it('should call CartsHelperService.getProductForCart', () => {
        expect(spy).not.toHaveBeenCalledWith({
          dcCode: 'dcCode',
          isSyncCart: true,
          newQuantity: 3,
          oldQuantity: 1,
          shouldApplyT2Rate: undefined,
          sku: 'sku1',
          t2Rate: 't2Rate',
          taxProfile: '1',
          supplyChannels: supplyChannelsMock,
          products: [
            {
              masterVariant: {
                sku: 'sku1',
                availability: {
                  channels: {
                    'with-less-stock-id': { availableQuantity: 100 }
                  }
                }
              },
              variants: []
            }
          ],
          distributionChannelId: 'distributionChannelId'
        });
      });

      it('should return lineItemsIdsToDelete and productsDraft', () => {
        expect(response).toEqual({
          lineItemsIdsToDelete: ['4bcdaaf2-6d5a-4377-9a70-77fc3e4bf428'],
          productsDraft: [{ sku: 'sku1', externalPrice: { centAmount: 2000, currencyCode: 'CLP' } }],
          isPriceUpdated: true,
          isQuantityUpdated: false
        });
      });
    });

    describe('when get products draft and line items ids to delete', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        mockProductsService.findAllProducts.mockResolvedValue([{ masterVariant: { sku: 'sku' } }]);
        spy = jest.spyOn(service, 'getProductForCart').mockImplementation(() => ({ sku: 'sku' }));
        response = await service.getProductsDraftAndLineItemsIdsToDelete({
          lineItemsDraft: [{ sku: 'sku1', quantity: 1 }],
          cart: mockCommercetoolsCartResponse,
          distributionChannelId: 'distributionChannelId',
          dcCode: 'dcCode',
          t2Rate: 't2Rate'
        });
      });

      afterAll(() => {
        spy.mockRestore();
      });

      it('should call ProductsService.findAllProducts', () => {
        expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(['sku1'], 'dcCode', 'distributionChannelId');
      });

      it('should call CartsHelperService.getProductForCart', () => {
        expect(spy).toHaveBeenCalledWith({
          dcCode: 'dcCode',
          isSyncCart: undefined,
          newQuantity: 1,
          oldQuantity: undefined,
          shouldApplyT2Rate: undefined,
          sku: 'sku1',
          t2Rate: 't2Rate',
          taxProfile: '1',
          supplyChannels: supplyChannelsMock,
          products: [{ masterVariant: { sku: 'sku' } }],
          distributionChannelId: 'distributionChannelId'
        });
      });

      it('should return lineItemsIdsToDelete and productsDraft', () => {
        expect(response).toEqual({ lineItemsIdsToDelete: [], productsDraft: [{ sku: 'sku' }], isPriceUpdated: false, isQuantityUpdated: false });
      });
    });

    describe('when existing line item', () => {
      let spy: jest.SpyInstance;

      beforeEach(async () => {
        mockProductsService.findAllProducts.mockResolvedValue([{ masterVariant: { sku: 'sku' } }]);
        spy = jest.spyOn(service, 'getProductForCart').mockImplementation(() => ({ sku: 'sku' }));
        response = await service.getProductsDraftAndLineItemsIdsToDelete({
          lineItemsDraft: [{ sku: 'sku1', quantity: 1 }],
          cart: mockCommercetoolsCartWithLineItemVariantAndCustomFieldsResponse as unknown as Cart,
          distributionChannelId: 'distributionChannelId',
          dcCode: 'dcCode',
          t2Rate: 't2Rate'
        });
      });

      afterAll(() => {
        spy.mockRestore();
      });

      it('should call ProductsService.findAllProducts', () => {
        expect(mockProductsService.findAllProducts).toHaveBeenCalledWith(['sku1'], 'dcCode', 'distributionChannelId');
      });

      it('should call CartsHelperService.getProductForCart', () => {
        expect(spy).toHaveBeenCalledWith({
          dcCode: 'dcCode',
          isSyncCart: undefined,
          newQuantity: 1,
          oldQuantity: 0,
          shouldApplyT2Rate: undefined,
          sku: 'sku1',
          t2Rate: 't2Rate',
          taxProfile: '1',
          supplyChannels: supplyChannelsMock,
          products: [{ masterVariant: { sku: 'sku' } }],
          distributionChannelId: 'distributionChannelId'
        });
      });

      it('should return lineItemsIdsToDelete and productsDraft', () => {
        expect(response).toEqual({ lineItemsIdsToDelete: ['lineItem-id'], productsDraft: [{ sku: 'sku' }], isPriceUpdated: false, isQuantityUpdated: false });
      });
    });
  });

  describe('validateStock', () => {
    let response: Error | ApiError | void;
    const variantSample = {
      id: 'id',
      sku: 'sku1',
      availability: { channels: { channelId: { isOnStock: true, availableQuantity: 100 } } },
      price: {
        value: {
          centAmount: 10,
          currency: 'CLP',
          fractionDigits: 0
        }
      }
    } as unknown as ProductVariant;

    describe('when sucess', () => {
      beforeEach(async () => {
        response = await service.validateStock(variantSample, 'key', 1, supplyChannelsMock);
      });

      it('should return undefined when validate successfully', () => {
        expect(response).toBeUndefined();
      });
    });

    describe('when not match channel', () => {
      beforeEach(async () => {
        try {
          await service.validateStock(variantSample, 'no-match', 1, supplyChannelsMock);
        } catch (error) {
          response = error;
        }
      });

      it('should throw BadRequestException', () => {
        expect(response).toEqual(new BadRequestException('Supply channel no-match not found'));
      });
    });

    describe('when not match availability', () => {
      beforeEach(async () => {
        try {
          const newVariantSample = {
            ...variantSample,
            availability: { channels: { secondChannelId: { isOnStock: true, availableQuantity: 100 } } }
          } as unknown as ProductVariant;
          await service.validateStock(newVariantSample, 'key', 1, supplyChannelsMock);
        } catch (error) {
          response = error;
        }
      });

      it('should return ApiError', () => {
        expect(response).toBeInstanceOf(ApiError);
      });

      it('should return the proper error', () => {
        expect((response as ApiError).code).toEqual('Carts-026');
      });

      it('should return the meta extra info', () => {
        expect((response as ApiError).meta).toEqual({
          availableQuantity: 0,
          dcCode: 'key',
          quantity: 1,
          sku: 'sku1'
        });
      });
    });

    describe('when not have stock', () => {
      beforeEach(async () => {
        try {
          const newVariantSample = {
            ...variantSample,
            availability: { channels: { channelId: { isOnStock: false, availableQuantity: 100 } } }
          } as unknown as ProductVariant;
          await service.validateStock(newVariantSample, 'key', 1, supplyChannelsMock);
        } catch (error) {
          response = error;
        }
      });
      it('should return ApiError', () => {
        expect(response).toBeInstanceOf(ApiError);
      });

      it('should return the proper error', () => {
        expect((response as ApiError).code).toEqual('Carts-026');
      });

      it('should return the meta extra info', () => {
        expect((response as ApiError).meta).toEqual({
          availableQuantity: 0,
          dcCode: 'key',
          quantity: 1,
          sku: 'sku1'
        });
      });
    });

    describe('when there are not enough units in stock', () => {
      beforeEach(async () => {
        try {
          await service.validateStock(variantSample, 'key', 101, supplyChannelsMock);
        } catch (error) {
          response = error;
        }
      });

      it('should return ApiError', () => {
        expect(response).toBeInstanceOf(ApiError);
      });

      it('should return the proper error', () => {
        expect((response as ApiError).code).toEqual('Carts-026');
      });

      it('should return the meta extra info', () => {
        expect((response as ApiError).meta).toEqual({
          availableQuantity: 100,
          dcCode: 'key',
          quantity: 101,
          sku: 'sku1'
        });
      });
    });
  });

  describe('getProductForCart', () => {
    let response: LineItemDraft | Error;

    describe('when success', () => {
      let mockValidateStock: jest.SpyInstance;
      let mockpriceCalculation: jest.SpyInstance;

      describe('should return successfully when not send isSyncCart and sum the quantity', () => {
        beforeEach(async () => {
          mockValidateStock = jest.spyOn(service, 'validateStock').mockImplementation(jest.fn());
          mockpriceCalculation = jest.spyOn(priceCalculation, 'calculatePriceForCTCart').mockImplementation(() => mockPriceForCTCart);
          response = service.getProductForCart({
            sku: 'sku1',
            products: [mockProductProjection],
            dcCode: 'dcCode',
            t2Rate: '100',
            newQuantity: 1,
            oldQuantity: 1,
            supplyChannels: [{ ...supplyChannelsMock, key: 'dcCode', id: 'supplyChannelId' }] as unknown as Channel[]
          });
        });

        it('should call validateStock', () => {
          expect(mockValidateStock).toHaveBeenCalledWith(mockProductProjection.masterVariant, 'dcCode', 1, [{ ...supplyChannelsMock, key: 'dcCode', id: 'supplyChannelId' }]);
        });

        it('should call calculatePriceForCTCart', () => {
          expect(mockpriceCalculation).toHaveBeenCalledWith({ product: mockProductProjection, sku: 'sku1', t2Rate: 100, taxProfile: '1' });
        });

        it('should return a LineItemDraft', () => {
          expect(response).toEqual({
            custom: {
              fields: { t2UnitAmount: 10, productDiscount: '{"description":"description","discountRate":0,"discountedAmount":0,"includedInPrice":true,"key":"discount"}' },
              type: { key: 'adelco-line-item-type', typeId: 'type' }
            },
            supplyChannel: {
              id: 'supplyChannelId',
              typeId: 'channel'
            },
            externalPrice: { centAmount: 8450, currencyCode: 'CLP' },
            externalTaxRate: { amount: 0, country: 'CL', includedInPrice: false, name: 'name', subRates: [{ amount: 0, name: 'name' }] },
            quantity: 2,
            sku: 'sku1'
          });
        });
      });

      describe('should return successfully when send isSyncCart, return the new quantity and return the supplyChannel', () => {
        beforeEach(async () => {
          mockValidateStock = jest.spyOn(service, 'validateStock').mockImplementation(jest.fn());
          mockpriceCalculation.mockImplementation(() => mockPriceForCTCart);
          response = await service.getProductForCart({
            sku: 'sku1',
            dcCode: 'dcCode',
            t2Rate: '100',
            newQuantity: 1,
            oldQuantity: 1,
            products: [mockProductProjection],
            isSyncCart: true,
            supplyChannels: [{ ...supplyChannelsMock, key: 'dcCode', id: 'supplyChannelId' }] as unknown as Channel[]
          });
        });

        it('should call validateStock', () => {
          expect(mockValidateStock).toHaveBeenCalledWith(mockProductProjection.masterVariant, 'dcCode', 1, [{ ...supplyChannelsMock, key: 'dcCode', id: 'supplyChannelId' }]);
        });

        it('should call calculatePriceForCTCart', () => {
          expect(mockpriceCalculation).toHaveBeenCalledWith({ product: mockProductProjection, sku: 'sku1', t2Rate: 100, taxProfile: '1' });
        });

        it('should return a LineItemDraft', () => {
          expect(response).toEqual({
            custom: {
              fields: { t2UnitAmount: 10, productDiscount: '{"description":"description","discountRate":0,"discountedAmount":0,"includedInPrice":true,"key":"discount"}' },
              type: { key: 'adelco-line-item-type', typeId: 'type' }
            },
            supplyChannel: {
              id: 'supplyChannelId',
              typeId: 'channel'
            },
            externalPrice: { centAmount: 8450, currencyCode: 'CLP' },
            externalTaxRate: { amount: 0, country: 'CL', includedInPrice: false, name: 'name', subRates: [{ amount: 0, name: 'name' }] },
            quantity: 1,
            sku: 'sku1'
          });
        });
      });
    });

    describe('when failure', () => {
      let mockValidateStock: jest.SpyInstance;

      beforeEach(async () => {
        mockValidateStock = jest.spyOn(service, 'validateStock').mockImplementation(jest.fn());

        mockPriceCalculation.mockImplementation(() => {
          throw new Error('Invalid');
        });
        try {
          await service.getProductForCart({
            sku: 'sku1',
            dcCode: 'dcCode',
            t2Rate: '100',
            newQuantity: 1,
            oldQuantity: 1,
            products: [mockProductProjection],
            supplyChannels: supplyChannelsMock
          });
        } catch (error) {
          response = error;
        }
      });

      it('should call validateStock', () => {
        expect(mockValidateStock).toHaveBeenCalledWith(mockProductProjection.masterVariant, 'dcCode', 1, supplyChannelsMock);
      });

      it('should call calculatePriceForCTCart', () => {
        expect(mockPriceCalculation).toHaveBeenCalledWith({ product: mockProductProjection, sku: 'sku1', t2Rate: 100, taxProfile: '1' });
      });

      it('should throw an error when calculatePriceForCTCart fail', () => {
        expect(response).toEqual(new BadRequestException('Invalid'));
      });
    });
  });

  describe('getDefaultDistributionChannelForDeliveryZone', () => {
    let response: string;

    describe('when matching channel is found', () => {
      beforeEach(async () => {
        response = await service.getDefaultDistributionChannelForDeliveryZone([{ value: { dcCode: 'dcCode' } }]);
      });

      it('should call getDefaultChannelForDistributionCenter', () => {
        expect(mockChannelsService.getDefaultChannelForDistributionCenter).toHaveBeenCalledWith('dcCode');
      });

      it('should return the id of the default distribution channel', () => {
        expect(response).toEqual('channelId');
      });
    });

    describe('when failure', () => {
      beforeEach(async () => {
        response = await service.getDefaultDistributionChannelForDeliveryZone([{ value: { dcCode: 'notFoundDcCode' } }]);
      });

      it('should call getDefaultChannelForDistributionCenter', () => {
        expect(mockChannelsService.getDefaultChannelForDistributionCenter).toHaveBeenCalledWith('notFoundDcCode');
      });

      it('should return undefined default distribution channel', () => {
        expect(response).toEqual(undefined);
      });
    });
  });

  describe('buildSyncCartActions', () => {
    describe('when build cart actions successfully', () => {
      let response: CartUpdateAction[];
      let spyBuildDiscountCodesActions: jest.SpyInstance;
      let spyBuildLineItemActions: jest.SpyInstance;

      beforeEach(() => {
        spyBuildDiscountCodesActions = jest.spyOn(service, 'buildDiscountCodesActions').mockImplementation(() => [
          {
            action: 'addDiscountCode',
            code: 'DISCOUNT'
          }
        ]);
        spyBuildLineItemActions = jest.spyOn(service, 'buildLineItemActions').mockImplementation(() => [
          {
            action: 'addLineItem',
            sku: 'sku'
          },
          {
            action: 'removeLineItem',
            lineItemId: 'lineItemId'
          }
        ]);
        response = service.buildSyncCartActions(mockCommercetoolsCartResponse, { lineItemsIdsToDelete: ['lineItem-id'], productsDraft: [{ sku: 'sku' }] }, ['DISCOUNT'], 'CREDIT');
      });

      afterEach(() => {
        spyBuildDiscountCodesActions.mockRestore();
        spyBuildLineItemActions.mockRestore();
      });

      it('should call CartsHelperService.buildDiscountCodesActions', () => {
        expect(spyBuildDiscountCodesActions).toHaveBeenCalledWith(
          [
            {
              discountCode: {
                id: 'discount-code-id',
                obj: {
                  cartDiscounts: [],
                  code: 'code-to-remove',
                  createdAt: '',
                  groups: [],
                  id: 'discount-code-id',
                  isActive: false,
                  lastModifiedAt: '',
                  references: [],
                  version: 0
                },
                typeId: 'discount-code'
              },
              state: ''
            }
          ],
          ['DISCOUNT']
        );
      });

      it('should call CartsHelperService.buildLineItemActions', () => {
        expect(spyBuildLineItemActions).toHaveBeenCalledWith([{ sku: 'sku' }], ['lineItem-id']);
      });

      it('should return CartUpdateAction', () => {
        expect(response).toEqual([
          { action: 'addDiscountCode', code: 'DISCOUNT' },
          { action: 'addLineItem', sku: 'sku' },
          { action: 'removeLineItem', lineItemId: 'lineItemId' },
          {
            action: 'setCustomField',
            name: 'uniqueSkuCount',
            value: 1
          }
        ]);
      });
    });
  });

  describe('buildLineItemActions', () => {
    describe('when build line items actions successfully', () => {
      let response: (CartAddLineItemAction | CartRemoveLineItemAction)[];

      beforeEach(() => {
        response = service.buildLineItemActions([{ sku: 'sku' }], ['lineItemId']);
      });

      it('should return (CartAddLineItemAction | CartRemoveLineItemAction)[]', () => {
        expect(response).toEqual([
          { action: 'addLineItem', sku: 'sku' },
          { action: 'removeLineItem', lineItemId: 'lineItemId' }
        ]);
      });
    });
  });

  describe('buildDiscountCodesActions', () => {
    let response: CartUpdateAction[];
    describe('when build cart add discount code actions successfully', () => {
      beforeEach(() => {
        response = service.buildDiscountCodesActions(
          [
            {
              discountCode: {
                typeId: 'discount-code',
                id: 'discount',
                obj: {
                  code: 'DISCOUNT',
                  id: '',
                  version: 0,
                  createdAt: '',
                  lastModifiedAt: '',
                  cartDiscounts: [],
                  isActive: false,
                  references: [],
                  groups: []
                }
              },
              state: 'MatchesCart'
            },
            {
              discountCode: {
                typeId: 'discount-code',
                id: 'new discount',
                obj: {
                  code: 'NEW-DISCOUNT',
                  id: '',
                  version: 0,
                  createdAt: '',
                  lastModifiedAt: '',
                  cartDiscounts: [],
                  isActive: false,
                  references: [],
                  groups: []
                }
              },
              state: 'MatchesCart'
            },
            {
              discountCode: {
                typeId: 'discount-code',
                id: 'SOME',
                obj: {
                  code: 'SOME',
                  id: '',
                  version: 0,
                  createdAt: '',
                  lastModifiedAt: '',
                  cartDiscounts: [],
                  isActive: false,
                  references: [],
                  groups: []
                }
              },
              state: 'MatchesCart'
            }
          ],
          ['DISCOUNT', 'OTHER']
        );
      });

      it('should return CartAddDiscountCodeAction[]', () => {
        expect(response).toEqual([
          { action: 'removeDiscountCode', discountCode: { id: 'new discount', typeId: 'discount-code' } },
          { action: 'removeDiscountCode', discountCode: { id: 'SOME', typeId: 'discount-code' } },
          { action: 'addDiscountCode', code: 'OTHER' }
        ]);
      });
    });

    describe('when not pass discount code', () => {
      beforeEach(() => {
        response = service.buildDiscountCodesActions([]);
      });

      it('should return empty array', () => {
        expect(response).toEqual([]);
      });
    });
  });

  describe('getShippingAddress', () => {
    describe('when there is defaultShippingAddressId', () => {
      test('should return the address set as default', () => {
        expect(
          service.getBusinessUnitShippingAddress({
            defaultShippingAddressId: '1',
            addresses: [
              { id: '2', country: 'CL', city: 'city1' },
              { id: '1', country: 'CL', city: 'city2' }
            ]
          })
        ).toEqual({ id: '1', country: 'CL', city: 'city2' });
      });
    });
    describe('when there is not defaultShippingAddressId but shippingAddressIds', () => {
      test('should return the address set as the first shippingAddressIds', () => {
        expect(
          service.getBusinessUnitShippingAddress({
            defaultShippingAddressId: undefined,
            shippingAddressIds: ['2'],
            addresses: [
              { id: '2', country: 'CL', city: 'city1' },
              { id: '1', country: 'CL', city: 'city2' }
            ]
          })
        ).toEqual({ id: '2', country: 'CL', city: 'city1' });
      });
    });

    describe('when there is not defaultShippingAddressId neither shippingAddressIds', () => {
      test('should return the first address ', () => {
        expect(
          service.getBusinessUnitShippingAddress({
            defaultShippingAddressId: undefined,
            shippingAddressIds: [],
            addresses: [
              { id: '3', country: 'CL', city: 'city3' },
              { id: '2', country: 'CL', city: 'city1' },
              { id: '1', country: 'CL', city: 'city2' }
            ]
          })
        ).toEqual({ id: '3', country: 'CL', city: 'city3' });
      });
    });
  });

  describe('checkIfLastVerificationIsOlderMaxConfig', () => {
    let response;

    const currentDate = '2023-09-11T11:00:00.000Z';
    const olderDate = '2023-09-10T11:00:00.000Z';
    const newerDate = '2023-09-11T10:00:00.000Z';
    let mockedDate;
    beforeEach(() => {
      mockedDate = createMockedDate(new Date(currentDate));
    });
    afterEach(() => {
      mockedDate.restore();
    });

    describe('when lastVerificationTime is undefined', () => {
      beforeEach(async () => {
        response = await service.checkIfLastVerificationIsOlderMaxConfig(mockCommercetoolsCartWithLastVerificationTimeResponse);
      });
      test('should return true', () => {
        expect(response).toEqual(true);
      });
    });

    describe('when lastVerificationTime is older than max config value', () => {
      beforeEach(async () => {
        response = await service.checkIfLastVerificationIsOlderMaxConfig({
          ...mockCommercetoolsCartWithLastVerificationTimeResponse,
          custom: {
            ...mockCommercetoolsCartWithLastVerificationTimeResponse.custom,
            fields: { ...mockCommercetoolsCartWithLastVerificationTimeResponse.custom.fields, lastVerificationTime: olderDate }
          }
        });
      });

      test('should return true', () => {
        expect(response).toEqual(true);
      });
    });

    describe('when lastVerificationTime is newer than max config value', () => {
      beforeEach(async () => {
        response = await service.checkIfLastVerificationIsOlderMaxConfig({
          ...mockCommercetoolsCartWithLastVerificationTimeResponse,
          custom: {
            ...mockCommercetoolsCartWithLastVerificationTimeResponse.custom,
            fields: { ...mockCommercetoolsCartWithLastVerificationTimeResponse.custom.fields, lastVerificationTime: newerDate }
          }
        });
      });

      test('should return false', () => {
        expect(response).toEqual(false);
      });
    });
  });

  describe('verifyPricesAndStock', () => {
    const currentDate = '2023-09-11T11:00:00.000Z';
    let mockedDate;
    let response;

    const mockSetLineItemPriceActions = [
      {
        action: 'setLineItemPrice',
        externalPrice: {
          centAmount: 32182,
          currencyCode: 'CLP'
        },
        lineItemId: '856f58f9-5cd6-41a9-b572-b95497e6a738'
      },
      {
        action: 'setLineItemPrice',
        externalPrice: {
          centAmount: 15287,
          currencyCode: 'CLP'
        },
        lineItemId: '196cd997-4cac-4786-8bc9-3781fbd057f5'
      },
      {
        action: 'setLineItemPrice',
        externalPrice: {
          centAmount: 1544,
          currencyCode: 'CLP'
        },
        lineItemId: 'ec49d848-6c7c-4784-8999-20ca1ca86b88'
      },

      {
        action: 'setLineItemPrice',
        externalPrice: {
          centAmount: 3265,
          currencyCode: 'CLP'
        },
        lineItemId: '6c931c3d-8bea-483d-998a-65696a50238b'
      }
    ];

    beforeEach(() => {
      mockProductsService.findAllProducts.mockResolvedValue([...mockProductsBySkus, mockBaseProduct]);
      mockedDate = createMockedDate(new Date(currentDate));
      mockPriceCalculation.mockImplementation(({ sku }) => {
        return { price: mockCommercetoolsCartWithLastVerificationTimeResponse.lineItems.find(lineItem => lineItem.variant.sku === sku).price.value.centAmount };
      });
    });
    afterEach(() => {
      mockedDate.restore();
    });

    describe('when cart has not line items', () => {
      beforeEach(async () => {
        response = await service.verifyPricesAndStock(
          { ...mockCommercetoolsCartWithLastVerificationTimeResponse, lineItems: [] },
          'dcCode',
          't2Rate',
          'distribution-channel-id',
          '1',
          true
        );
      });

      test('should return is quantity updated flag with false value', () => {
        expect(response.isQuantityUpdated).toEqual(false);
      });

      test('should return is price updated flag with false value', () => {
        expect(response.isPriceUpdated).toEqual(false);
      });

      test('should return empty array of actions', () => {
        expect(response.updatedActions).toEqual([]);
      });
    });

    describe('when inventory has changed', () => {
      describe('when line item quantity is greater than inventory quantity', () => {
        beforeEach(async () => {
          mockProductsService.findAllProducts.mockResolvedValue([...mockProductsBySkus, mockProductWithLessStock]);

          response = await service.verifyPricesAndStock(mockCommercetoolsCartWithLastVerificationTimeResponse, 'dcCode', 't2Rate', 'distribution-channel-id', '1', true);
        });

        test('should return is quantity updated flag with true value', () => {
          expect(response.isQuantityUpdated).toEqual(true);
        });

        test('should return is price updated flag with false value', () => {
          expect(response.isPriceUpdated).toEqual(false);
        });

        test('should return an array with actions to update quantity of the lineItems', () => {
          expect(response.updatedActions).toEqual([
            {
              action: 'changeLineItemQuantity',
              lineItemId: '6c931c3d-8bea-483d-998a-65696a50238b',
              quantity: 2,
              externalPrice: {
                centAmount: 3365,
                currencyCode: 'CLP'
              }
            }
          ]);
        });
      });

      describe('when inventory is zero', () => {
        beforeEach(async () => {
          mockProductsService.findAllProducts.mockResolvedValue([...mockProductsBySkus, mockProductWithoutStock]);

          response = await service.verifyPricesAndStock(mockCommercetoolsCartWithLastVerificationTimeResponse, 'dcCode', 't2Rate', 'distribution-channel-id', '1', true);
        });

        test('should return is quantity updated flag with true value', () => {
          expect(response.isQuantityUpdated).toEqual(true);
        });

        test('should return is price updated flag with false value', () => {
          expect(response.isPriceUpdated).toEqual(false);
        });

        test('should return an array with actions to remove items without stock', () => {
          expect(response.updatedActions).toEqual([
            {
              action: 'removeLineItem',
              lineItemId: '6c931c3d-8bea-483d-998a-65696a50238b'
            }
          ]);
        });
      });
    });

    describe('when price has changed', () => {
      beforeEach(async () => {
        mockProductsService.findAllProducts.mockResolvedValue([...mockProductsBySkus, mockBaseProduct]);
        mockPriceCalculation.mockImplementation(({ sku }) => {
          return { price: mockCommercetoolsCartWithLastVerificationTimeResponse.lineItems.find(lineItem => lineItem.variant.sku === sku).price.value.centAmount - 100 };
        });
        response = await service.verifyPricesAndStock(mockCommercetoolsCartWithLastVerificationTimeResponse, 'dcCode', 't2Rate', 'distribution-channel-id', '1', true);
      });

      test('should return an array with prices to be updated', () => {
        expect(response.updatedActions).toEqual(mockSetLineItemPriceActions);
      });
      test('should return is price updated flag with true value', () => {
        expect(response.isPriceUpdated).toEqual(true);
      });
    });

    describe('when product no longer exists', () => {
      beforeEach(async () => {
        mockProductsService.findAllProducts.mockResolvedValue([...mockProductsBySkus]);

        response = await service.verifyPricesAndStock(mockCommercetoolsCartWithLastVerificationTimeResponse, 'dcCode', 't2Rate', 'distribution-channel-id', '1', true);
      });

      test('should return is quantity updated flag with true value', () => {
        expect(response.isQuantityUpdated).toEqual(true);
      });

      test('should return is price updated flag with false value', () => {
        expect(response.isPriceUpdated).toEqual(false);
      });

      test('should return an array with actions to remove items that no longer exist', () => {
        expect(response.updatedActions).toEqual([
          {
            action: 'removeLineItem',
            lineItemId: '6c931c3d-8bea-483d-998a-65696a50238b'
          }
        ]);
      });
    });
  });

  describe('getLineItemsToAdd', () => {
    it('should return line items from anonymous cart if cart is not defined', () => {
      const anonymousCart = {
        lineItems: [{ variant: { sku: 'sku1' }, quantity: 5 }]
      };

      const result = service.getLineItemsToAdd(anonymousCart as Cart);

      expect(result).toEqual([{ sku: 'sku1', quantity: 5 }]);
    });

    it('should merge non-overlapping skus from both carts', () => {
      const anonymousCart = {
        lineItems: [{ variant: { sku: 'sku1' }, quantity: 5 }]
      };
      const cart = {
        lineItems: [{ variant: { sku: 'sku2' }, quantity: 10 }]
      };

      const result = service.getLineItemsToAdd(anonymousCart as Cart, cart as Cart);

      expect(result).toContainEqual({ sku: 'sku1', quantity: 5 });
      expect(result).toContainEqual({ sku: 'sku2', quantity: 10 });
    });

    it('should favor higher quantities from anonymous cart for overlapping skus', () => {
      const anonymousCart = {
        lineItems: [{ variant: { sku: 'sku1' }, quantity: 15 }]
      };
      const cart = {
        lineItems: [{ variant: { sku: 'sku1' }, quantity: 10 }]
      };

      const result = service.getLineItemsToAdd(anonymousCart as Cart, cart as Cart);

      expect(result).toEqual([{ sku: 'sku1', quantity: 15 }]);
    });

    it('should favor quantities from cart if they are greater or equal for overlapping skus', () => {
      const anonymousCart = {
        lineItems: [{ variant: { sku: 'sku1' }, quantity: 5 }]
      };
      const cart = {
        lineItems: [{ variant: { sku: 'sku1' }, quantity: 10 }]
      };

      const result = service.getLineItemsToAdd(anonymousCart as Cart, cart as Cart);

      expect(result).toEqual([{ sku: 'sku1', quantity: 10 }]);
    });
  });

  describe('buildCustomFieldActions', () => {
    it('should return custom field actions', () => {
      const result = service.buildCustomFieldActions(mockLineItemsDraft);

      expect(result).toEqual([
        {
          action: 'setCustomField',
          name: 'uniqueSkuCount',
          value: 1
        }
      ]);
    });
  });
});
