const mockProductProjectionsRepository = {
  find: jest.fn((methodArgs: { queryArgs: { where: string[] } }) => {
    if (methodArgs.queryArgs.where[1].indexOf('error-sku') >= 0) {
      return Promise.reject(new Error('Commercetools error'));
    }
    if (methodArgs.queryArgs.where[1].indexOf('no-match-sku') >= 0) {
      return Promise.resolve({
        limit: 1,
        offset: 0,
        count: 0,
        total: 0,
        results: []
      });
    }
    return Promise.resolve({
      limit: 1,
      offset: 0,
      count: 1,
      total: 1,
      results: [
        {
          id: 'prod-id',
          key: 'prod-key',
          price: {
            centAmount: 10,
            currency: 'CLP',
            fractionDigits: 0
          }
        }
      ]
    });
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  ProductProjectionsRepository: jest.fn().mockImplementation(() => mockProductProjectionsRepository)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'products.priceCurrency':
        return 'CLP';
      default:
        return key;
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { ProductProjection } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductProjectionsRepository } from 'commercetools-sdk-repositories';
import { ProductsService } from '../products.service';
import { NotFoundException } from '@nestjs/common';
import { CommercetoolsError } from '@/nest-commercetools';
import { ApiError } from '@/common/errors/api.error';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, ProductProjectionsRepository, ConfigService]
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('getProductBySku', () => {
    let response: Error | ProductProjection | ApiError;
    let supplyChannelKey: string;
    let sku: string;
    let distributionChannelId: string;
    const defaultQueryArgs = {
      expand: ['taxCategory', 'masterVariant.price.discounted.discount'],
      offset: 0,
      sort: ['createdAt desc']
    };
    const defaultQueryArgsForPrices = {
      priceCurrency: 'CLP',
      priceCountry: 'products.priceCountry'
    };

    describe('when productProjectionsRepository.find succeeds', () => {
      let expectedResponse;

      beforeAll(() => {
        expectedResponse = {
          id: 'prod-id',
          key: 'prod-key',
          price: {
            centAmount: 10,
            currency: 'CLP',
            fractionDigits: 0
          }
        };
      });

      describe('when supply channel is provided without distribution channel', () => {
        beforeAll(() => {
          supplyChannelKey = 'PM';
          sku = 'validSku';
        });

        beforeEach(async () => {
          response = await service.getProductBySku(sku, supplyChannelKey);
        });

        it('should call productProjectionsRepository.find for requested distribution center without distribution channel info', () => {
          expect(mockProductProjectionsRepository.find).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              where: [`masterVariant(attributes(name="enabledForDistributionCenters" AND value(key="PM")))`, `variants(sku in ("validSku")) OR masterVariant(sku in ("validSku"))`]
            }
          });
        });

        it('should return productProjectionsRepository.find response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a supply channel and a distribution channel are provided', () => {
        beforeAll(() => {
          supplyChannelKey = 'PM';
          sku = 'validSku';
          distributionChannelId = 'dist-channel-id';
        });

        beforeEach(async () => {
          response = await service.getProductBySku(sku, supplyChannelKey, distributionChannelId);
        });

        it('should call productProjectionsRepository.find for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.find).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'dist-channel-id',
              where: [`masterVariant(attributes(name="enabledForDistributionCenters" AND value(key="PM")))`, `variants(sku in ("validSku")) OR masterVariant(sku in ("validSku"))`]
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a product is not found with the sku', () => {
        beforeAll(() => {
          supplyChannelKey = 'PM';
          sku = 'no-match-sku';
          distributionChannelId = 'dist-channel-id';
        });

        beforeEach(async () => {
          try {
            await service.getProductBySku(sku, supplyChannelKey, distributionChannelId);
          } catch (e) {
            response = e as NotFoundException;
          }
        });

        it('should call productProjectionsRepository.find for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.find).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'dist-channel-id',
              where: [
                `masterVariant(attributes(name="enabledForDistributionCenters" AND value(key="PM")))`,
                `variants(sku in ("no-match-sku")) OR masterVariant(sku in ("no-match-sku"))`
              ]
            }
          });
        });

        it('should return ApiError', () => {
          expect(response).toBeInstanceOf(ApiError);
        });

        it('should return the proper error', () => {
          expect((response as ApiError).code).toEqual('Carts-034');
        });
      });
    });

    describe('when an error is thrown by CT', () => {
      let response: Error;
      let supplyChannelKey: string;
      let sku: string;
      let distributionChannelId: string;
      beforeAll(() => {
        supplyChannelKey = 'PM';
        sku = 'error-sku';
        distributionChannelId = 'dist-channel-id';
      });

      beforeEach(async () => {
        try {
          await service.getProductBySku(sku, supplyChannelKey, distributionChannelId);
        } catch (e) {
          response = e as CommercetoolsError;
        }
      });

      it('should call productProjectionsRepository.find for requested distribution center and include price channel info', () => {
        expect(mockProductProjectionsRepository.find).toHaveBeenCalledWith({
          queryArgs: {
            ...defaultQueryArgs,
            ...defaultQueryArgsForPrices,
            priceChannel: 'dist-channel-id',
            where: [`masterVariant(attributes(name="enabledForDistributionCenters" AND value(key="PM")))`, `variants(sku in ("error-sku")) OR masterVariant(sku in ("error-sku"))`]
          }
        });
      });

      it('should return productProjectionsRepository.search response', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });

  describe('findAllProducts', () => {
    let result: ProductProjection[];

    beforeEach(async () => {
      mockProductProjectionsRepository.find = jest
        .fn()
        .mockResolvedValueOnce({
          results: [
            { id: 'id1', lastModifiedAt: '2023-07-07T07:54:27.977Z' },
            { id: 'id2', lastModifiedAt: '2023-07-06T07:54:27.977Z' }
          ]
        })
        .mockResolvedValueOnce({
          results: []
        });

      result = await service.findAllProducts(['sku1', 'sku2'], 'distributionCenterKey', undefined);
    });

    test('shoudl call repository.find', () => {
      expect(mockProductProjectionsRepository.find).toHaveBeenNthCalledWith(1, {
        queryArgs: {
          expand: ['taxCategory', 'masterVariant.price.discounted.discount'],
          limit: 500,
          offset: 0,
          sort: 'id asc',
          where: [
            'masterVariant(attributes(name="enabledForDistributionCenters" AND value(key="distributionCenterKey")))',
            'variants(sku in ("sku1","sku2")) OR masterVariant(sku in ("sku1","sku2"))'
          ],
          withTotal: false
        }
      });
    });

    test('should return results', () => {
      expect(result).toEqual([
        {
          id: 'id1',
          lastModifiedAt: '2023-07-07T07:54:27.977Z'
        },
        {
          id: 'id2',
          lastModifiedAt: '2023-07-06T07:54:27.977Z'
        }
      ]);
    });

    describe('when distributionChannelId', () => {
      beforeEach(async () => {
        mockProductProjectionsRepository.find = jest
          .fn()
          .mockResolvedValueOnce({
            results: [
              { id: 'id1', lastModifiedAt: '2023-07-07T07:54:27.977Z' },
              { id: 'id2', lastModifiedAt: '2023-07-06T07:54:27.977Z' }
            ]
          })
          .mockResolvedValueOnce({
            results: []
          });

        result = await service.findAllProducts(['sku1', 'sku2'], 'distributionCenterKey', 'distributionChannelId');
      });

      test('shoudl call repository.find', () => {
        expect(mockProductProjectionsRepository.find).toHaveBeenNthCalledWith(1, {
          queryArgs: {
            expand: ['taxCategory', 'masterVariant.price.discounted.discount'],
            limit: 500,
            offset: 0,
            priceChannel: 'distributionChannelId',
            priceCountry: 'products.priceCountry',
            priceCurrency: 'CLP',
            sort: 'id asc',
            where: [
              'masterVariant(attributes(name="enabledForDistributionCenters" AND value(key="distributionCenterKey")))',
              'variants(sku in ("sku1","sku2")) OR masterVariant(sku in ("sku1","sku2"))'
            ],
            withTotal: false
          }
        });
      });
    });
  });
});
