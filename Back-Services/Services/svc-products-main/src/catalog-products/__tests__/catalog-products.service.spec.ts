const mockCategoriesService = {
  query: jest.fn(() => {
    return Promise.resolve({
      limit: 1,
      offset: 0,
      count: 1,
      total: 1,
      results: [
        {
          id: 'category-id',
          slug: {
            'es-CL': 'category-id'
          }
        }
      ]
    });
  })
};

const mockProductsService = {
  getProducts: jest.fn((supplyChannel, queryArgs: { limit }) => {
    if (queryArgs?.limit === 111) {
      return Promise.resolve(undefined);
    }
    if (supplyChannel === 'dcp') {
      return Promise.resolve({
        limit: 20,
        offset: 0,
        count: 1,
        total: 1,
        results: [
          {
            id: 'prod-id',
            key: 'prod-key',
            taxCategory: {
              obj: {
                rates: [
                  {
                    amount: 0.19
                  }
                ]
              }
            },
            masterVariant: {
              attributes: [{ operationalUnitPerBox: 1 }],
              price: {
                value: {
                  centAmount: 10,
                  currency: 'CLP',
                  fractionDigits: 0
                }
              }
            }
          },
          {
            id: 'prod-id2',
            key: 'prod-key2',
            masterVariant: {
              attributes: [{ operationalUnitPerBox: 1 }]
            }
          }
        ]
      });
    }
    return Promise.resolve({
      limit: 20,
      offset: 0,
      count: 1,
      total: 1,
      results: [
        {
          id: 'prod-id',
          key: 'prod-key',
          taxCategory: {
            obj: {
              rates: [
                {
                  amount: 0.19
                }
              ]
            }
          },
          masterVariant: {
            attributes: [{ operationalUnitPerBox: 1 }]
          }
        }
      ]
    });
  }),
  getSuggestions: jest.fn(() => Promise.resolve({ 'searchKeywords.es-CL': [{ text: 'Yerba' }, { text: 'Mate' }] }))
};

const mockDeliveryZonesService = {
  getT2Zone: jest.fn((key: string) => {
    switch (key) {
      case 'not-exists':
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
      case 'not-matching':
        return Promise.resolve({
          id: 'id',
          container: 'container',
          key: 'key',
          value: {
            label: 'Label',
            t2Rate: '0.1',
            dcCode: 'other-dc'
          }
        });
      default:
        return Promise.resolve({
          id: 'id',
          container: 'container',
          key: 'key',
          value: {
            label: 'Label',
            t2Rate: '0.1',
            dcCode: key
          }
        });
    }
  })
};

const mockChannelsService = {
  getChannel: jest.fn(id => {
    switch (id) {
      case 'not-exists':
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
      case 'channelIdPrice':
        return Promise.resolve({
          id: 'channelIdPrice',
          key: 'dcp_sku',
          custom: {
            fields: {
              distributionCenterCode: 'dcp'
            }
          },
          roles: ['ProductDistribution']
        });
      default:
        return Promise.resolve({
          id: 'channelId',
          key: 'dc_sku',
          custom: {
            fields: {
              distributionCenterCode: 'dc'
            }
          },
          roles: ['ProductDistribution']
        });
    }
  })
};

const mockConfigService = {
  get: (key: string) => key
};

const mockLoggerService = {
  log: jest.fn()
};

const mockRegisterAs = () => ({
  pinoHttp: {
    customProps: () => ({
      context: 'HTTP'
    }),
    transport: {
      target: 'pino-pretty',
      options: {
        sync: true,
        singleLine: true
      }
    }
  }
});

const mockCache = {
  get: jest.fn(data => Promise.resolve(data)),
  set: jest.fn(() => Promise.resolve())
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService),
  registerAs: jest.fn(() => mockRegisterAs)
}));

jest.mock('@/delivery-zones/delivery-zones.service', () => ({
  DeliveryZonesService: jest.fn().mockImplementation(() => mockDeliveryZonesService)
}));

jest.mock('../converter', () => ({
  convertProduct: jest.fn().mockImplementation(product => product)
}));

jest.mock('@/channels/channels.service', () => ({
  ChannelsService: jest.fn().mockImplementation(() => mockChannelsService)
}));

jest.mock('@/products/products.service', () => ({
  ProductsService: jest.fn().mockImplementation(() => mockProductsService)
}));

jest.mock('@/categories/categories.service', () => ({
  CategoriesService: jest.fn().mockImplementation(() => mockCategoriesService)
}));

jest.mock('@/common/utils/logger/logger.service', () => ({
  LoggerService: jest.fn().mockImplementation(() => mockLoggerService)
}));

import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { ChannelsService } from '@/channels/channels.service';
import { ProductsService } from '@/products/products.service';
import { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CatalogProductsService } from '../catalog-products.service';
import { CommercetoolsError } from '@/nest-commercetools/errors';
import { ApiError, T2_ZONE_OVERLAP_ERROR } from '@/common/errors/api.error';
import { CategoriesService } from '@/categories/categories.service';
import { NotFoundException } from '@nestjs/common';
import { ProductSuggestionsResponseDto } from '../dto/productSuggestionsResponse.dto';
import { convertProduct } from '../converter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { EXENTO } from '@adelco/price-calc';

describe('ProductsService', () => {
  let service: CatalogProductsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatalogProductsService, DeliveryZonesService, ChannelsService, ProductsService, ConfigService, CategoriesService, { provide: CACHE_MANAGER, useValue: mockCache }]
    }).compile();

    service = module.get<CatalogProductsService>(CatalogProductsService);
  });

  describe('getProductsWithPrices', () => {
    let response: Error | CommercetoolsError | ProductProjectionPagedSearchResponse;

    describe('when no price information is returned', () => {
      const expectedResponse = {
        limit: 20,
        offset: 0,
        count: 1,
        total: 1,
        results: [
          {
            id: 'prod-id',
            key: 'prod-key',
            masterVariant: {
              attributes: [{ operationalUnitPerBox: 1 }]
            },
            taxCategory: {
              obj: { rates: [{ amount: 0.19 }] }
            }
          }
        ]
      };

      // channel provided exists and no zone is provided (no prices)
      describe('when valid supply channel is provided without t2 zone', () => {
        beforeEach(async () => {
          response = await service.getProductsWithPrices({ dch: 'channelId' });
        });

        it('should call ChannelsService', () => {
          expect(mockChannelsService.getChannel).toHaveBeenCalledWith('channelId');
        });

        it('should not call CustomObjectsService', () => {
          expect(mockDeliveryZonesService.getT2Zone).not.toHaveBeenCalled();
        });

        it('should call ProductsService for requested distribution center without price info', () => {
          expect(mockProductsService.getProducts).toHaveBeenCalledWith('dc', {
            dch: 'channelId'
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      // neither channel nor t2 zone provided (default distribution center without prices)
      describe('when channel and t2 zone are not provided', () => {
        beforeEach(async () => {
          response = await service.getProductsWithPrices({});
        });

        it('should not call ChannelsService', () => {
          expect(mockChannelsService.getChannel).not.toHaveBeenCalled();
        });

        it('should not call CustomObjectsService', () => {
          expect(mockDeliveryZonesService.getT2Zone).not.toHaveBeenCalled();
        });

        it('should call ProductsService', () => {
          expect(mockProductsService.getProducts).toHaveBeenCalledWith(undefined, {});
        });

        it('should return productProjectionsRepository with products', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });

    describe('when products with prices are returned', () => {
      const expectedResponse = {
        limit: 20,
        offset: 0,
        count: 1,
        total: 1,
        results: [
          {
            id: 'prod-id',
            key: 'prod-key',
            taxCategory: {
              obj: {
                rates: [
                  {
                    amount: 0.19
                  }
                ]
              }
            },
            masterVariant: {
              attributes: [{ operationalUnitPerBox: 1 }],
              price: {
                value: {
                  centAmount: 10,
                  currency: 'CLP',
                  fractionDigits: 0
                }
              }
            }
          },
          {
            id: 'prod-id2',
            key: 'prod-key2',
            masterVariant: {
              attributes: [{ operationalUnitPerBox: 1 }]
            }
          }
        ]
      };

      // channel provided exists and valid zone (return prices)
      describe('when a distribution channel and valid t2 zone are provided', () => {
        beforeEach(async () => {
          response = await service.getProductsWithPrices({
            dch: 'channelIdPrice',
            t2z: 'dcp'
          });
        });

        it('should call ChannelsService', () => {
          expect(mockChannelsService.getChannel).toHaveBeenCalledWith('channelIdPrice');
        });

        it('should call CustomObjectsService', () => {
          expect(mockDeliveryZonesService.getT2Zone).toHaveBeenCalledWith('dcp');
        });

        it('should call ProductsService for requested distribution center and include price channel info', () => {
          expect(mockProductsService.getProducts).toHaveBeenCalledWith('dcp', {
            dch: 'channelIdPrice',
            t2z: 'dcp'
          });
        });

        // it('should call calculate price', () => {
        //     expect(mockPriceCalculation.calculateProductPrice).toHaveBeenCalled();
        // });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      // when providing a search key
      describe('when a distribution channel and valid t2 zone are provided', () => {
        beforeEach(async () => {
          response = await service.getProductsWithPrices({
            dch: 'channelIdPrice',
            t2z: 'dcp',
            'text.es-CL': 'searchKey'
          });
        });

        it('should call ChannelsService', () => {
          expect(mockChannelsService.getChannel).toHaveBeenCalledWith('channelIdPrice');
        });

        it('should call CustomObjectsService', () => {
          expect(mockDeliveryZonesService.getT2Zone).toHaveBeenCalledWith('dcp');
        });

        it('should call ProductsService for requested distribution center and include price channel info', () => {
          expect(mockProductsService.getProducts).toHaveBeenCalledWith('dcp', {
            dch: 'channelIdPrice',
            t2z: 'dcp',
            'text.es-CL': 'searchKey'
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      // filters and facets are provided
      describe('when a distribution channel and valid t2 zone are provided', () => {
        beforeEach(async () => {
          response = await service.getProductsWithPrices({
            dch: 'channelIdPrice',
            t2z: 'dcp',
            filter: ['field:"key"', 'anotherField:"key2"'],
            'filter.query': ['field:"key"', 'anotherField:"key2"'],
            'filter.facets': ['facet', 'anotherFacet'],
            facet: ['facet', 'anotherFacet']
          });
        });

        it('should call ChannelsService', () => {
          expect(mockChannelsService.getChannel).toHaveBeenCalledWith('channelIdPrice');
        });

        it('should call CustomObjectsService', () => {
          expect(mockDeliveryZonesService.getT2Zone).toHaveBeenCalledWith('dcp');
        });

        it('should call ProductsService for requested distribution center and include price channel info', () => {
          expect(mockProductsService.getProducts).toHaveBeenCalledWith('dcp', {
            dch: 'channelIdPrice',
            t2z: 'dcp',
            filter: ['field:"key"', 'anotherField:"key2"'],
            'filter.query': ['field:"key"', 'anotherField:"key2"'],
            'filter.facets': ['facet', 'anotherFacet'],
            facet: ['facet', 'anotherFacet']
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      // when providing useT2Rate and taxProfile
      describe('when a distribution channel and valid t2 zone are provided', () => {
        describe('when a useT2Rate is true and taxProfile is provided', () => {
          beforeEach(async () => {
            response = await service.getProductsWithPrices({
              dch: 'channelIdPrice',
              t2z: 'dcp',
              useT2Rate: true,
              taxProfile: EXENTO
            });
          });

          it('should call ChannelsService', () => {
            expect(mockChannelsService.getChannel).toHaveBeenCalledWith('channelIdPrice');
          });

          it('should call CustomObjectsService', () => {
            expect(mockDeliveryZonesService.getT2Zone).toHaveBeenCalledWith('dcp');
          });

          it('should call ProductsService for requested distribution center and include price channel info', () => {
            expect(mockProductsService.getProducts).toHaveBeenCalledWith('dcp', {
              dch: 'channelIdPrice',
              t2z: 'dcp',
              useT2Rate: true,
              taxProfile: EXENTO
            });
          });

          it('should call convertProduct with the correct parameters', () => {
            expect(convertProduct).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ t2Rate: '0.1' }), EXENTO, true);
          });
        });
        describe('when a useT2Rate is false and taxProfile is provided', () => {
          beforeEach(async () => {
            response = await service.getProductsWithPrices({
              dch: 'channelIdPrice',
              t2z: 'dcp',
              useT2Rate: false,
              taxProfile: EXENTO
            });
          });

          it('should call ChannelsService', () => {
            expect(mockChannelsService.getChannel).toHaveBeenCalledWith('channelIdPrice');
          });

          it('should call CustomObjectsService', () => {
            expect(mockDeliveryZonesService.getT2Zone).toHaveBeenCalledWith('dcp');
          });

          it('should call ProductsService for requested distribution center and include price channel info', () => {
            expect(mockProductsService.getProducts).toHaveBeenCalledWith('dcp', {
              dch: 'channelIdPrice',
              t2z: 'dcp',
              useT2Rate: false,
              taxProfile: EXENTO
            });
          });

          it('should call convertProduct with the correct parameters', () => {
            expect(convertProduct).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ t2Rate: '0.1' }), EXENTO, false);
          });
        });
      });
    });

    describe('when error is returned', () => {
      let expectedResponse: CommercetoolsError | ApiError;

      // channel provided does not exist (error returned)
      describe('a non existing channel is provided and non matching zone', () => {
        beforeEach(async () => {
          expectedResponse = new CommercetoolsError({
            statusCode: 404,
            message: "The Resource with ID 'error' was not found.",
            errors: [
              {
                code: 'ResourceNotFound',
                message: "The Resource with ID 'error' was not found."
              }
            ]
          });
          try {
            response = await service.getProductsWithPrices({
              dch: 'not-exists',
              t2z: 'not-matching'
            });
          } catch (e) {
            response = e as CommercetoolsError;
          }
        });

        it('should call ChannelsService', () => {
          expect(mockChannelsService.getChannel).toHaveBeenCalledWith('not-exists');
        });
        it('should not call CustomObjectsService', () => {
          expect(mockDeliveryZonesService.getT2Zone).not.toHaveBeenCalled();
        });

        it('should not call ProductsService', () => {
          expect(mockProductsService.getProducts).not.toHaveBeenCalled();
        });

        it('should throw productProjectionsRepository.search error', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      // channel provided exists but t2 zone does not match (error returned)
      describe('a valid channel is provided and non matching zone', () => {
        beforeEach(async () => {
          expectedResponse = new ApiError({
            status: 400,
            code: T2_ZONE_OVERLAP_ERROR,
            title: 'T2 zone does not match distribution center',
            detail: 'T2 zone does not match distribution center'
          });
          try {
            response = await service.getProductsWithPrices({
              dch: 'channel-id',
              t2z: 'not-matching'
            });
          } catch (e) {
            response = e as Error;
          }
        });

        it('should call ChannelsService', () => {
          expect(mockChannelsService.getChannel).toHaveBeenCalledWith('channel-id');
        });
        it('should call CustomObjectsService', () => {
          expect(mockDeliveryZonesService.getT2Zone).toHaveBeenCalledWith('not-matching');
        });

        it('should not call ProductsService', () => {
          expect(mockProductsService.getProducts).not.toHaveBeenCalled();
        });

        it('should throw productProjectionsRepository.search error', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      // Invalid t2zone is provided
      describe('an existing channel is provided and non existing zone', () => {
        beforeEach(async () => {
          expectedResponse = new CommercetoolsError({
            statusCode: 404,
            message: "The CustomObject with ID '(container,error)' was not found.",
            errors: [
              {
                code: 'InvalidSubject',
                message: "The CustomObject with ID '(container,error)' was not found."
              }
            ]
          });
          try {
            response = await service.getProductsWithPrices({
              dch: 'channel-id',
              t2z: 'not-exists'
            });
          } catch (e) {
            response = e as CommercetoolsError;
          }
        });

        it('should call ChannelsService', () => {
          expect(mockChannelsService.getChannel).toHaveBeenCalledWith('channel-id');
        });
        it('should not call CustomObjectsService', () => {
          expect(mockDeliveryZonesService.getT2Zone).toHaveBeenCalledWith('not-exists');
        });

        it('should not call ProductsService', () => {
          expect(mockProductsService.getProducts).not.toHaveBeenCalled();
        });

        it('should throw productProjectionsRepository.search error', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });
  });

  describe('getProductsByCategorySlug', () => {
    describe('when valid category-slug is provided and a filter value', () => {
      const getProductsWithPricesMock = jest.fn();
      beforeEach(async () => {
        jest.spyOn(service, 'getProductsWithPrices').mockImplementation(getProductsWithPricesMock);
        await service.getProductsByCategorySlug('category-slug', { filter: 'other-filter' });
      });

      it('should call query from categories service', () => {
        expect(mockCategoriesService.query).toHaveBeenCalledWith({
          limit: 1,
          where: decodeURIComponent(`slug(es-CL="category-slug")`)
        });
      });

      it('should call getProductsWithPrices', () => {
        expect(getProductsWithPricesMock).toHaveBeenCalledWith({ filter: 'other-filter', 'filter.query': [`categories.id:"category-id"`] });
      });
    });

    describe('when valid category-slug is provided and a no filter value', () => {
      const getProductsWithPricesMock = jest.fn();
      beforeEach(async () => {
        jest.spyOn(service, 'getProductsWithPrices').mockImplementation(getProductsWithPricesMock);
        await service.getProductsByCategorySlug('category-slug', { filter: [] });
      });

      it('should call query from categories service', () => {
        expect(mockCategoriesService.query).toHaveBeenCalledWith({
          limit: 1,
          where: decodeURIComponent(`slug(es-CL="category-slug")`)
        });
      });

      it('should call getProductsWithPrices', () => {
        expect(getProductsWithPricesMock).toHaveBeenCalledWith({ filter: [], 'filter.query': [`categories.id:"category-id"`] });
      });
    });

    describe('when products are cached and limit is under 10', () => {
      beforeEach(async () => {
        mockCache.get.mockReturnValue(Promise.resolve(true));
        await service.getProductsByCategorySlug('category-slug', { limit: 5 });
      });

      afterEach(() => {
        mockCache.get.mockReset();
      });

      it('should call loggerService', () => {
        expect(mockLoggerService.log).toHaveBeenCalledWith('Cache hit: Products for Slug Category');
      });
    });

    describe('when products are not cached and limit is under 10', () => {
      beforeEach(async () => {
        mockCache.get.mockReturnValue(Promise.resolve(false));
        await service.getProductsByCategorySlug('category-slug', { limit: 5, dch: 'dch' });
      });

      afterEach(() => {
        mockCache.get.mockReset();
      });

      it('should call loggerService', () => {
        expect(mockCache.set).toHaveBeenCalled();
      });

      it('should call loggerService', () => {
        expect(mockLoggerService.log).toHaveBeenCalled();
      });
    });

    describe('when invalid category-slug is provided', () => {
      beforeEach(async () => {
        mockCategoriesService.query.mockImplementation(() =>
          Promise.resolve({
            limit: 0,
            offset: 0,
            count: 0,
            total: 0,
            results: undefined
          })
        );
      });

      it('should throw error', async () => {
        try {
          await service.getProductsByCategorySlug('bad-category-slug', { filter: [] });
        } catch (error) {
          expect(error).toEqual(new NotFoundException('Not Found'));
        }
      });
    });
  });

  describe('getSuggestions', () => {
    let response: Partial<ProductSuggestionsResponseDto>;
    describe('when searching for product suggestions', () => {
      beforeEach(async () => {
        response = await service.getProductSuggestions({
          'searchKeywords.es-CL': 'yerb',
          limit: 15,
          fuzzy: true,
          staged: true
        });
      });

      it('should call getSuggrestions from products service', () => {
        expect(mockProductsService.getSuggestions).toHaveBeenCalledWith({
          'searchKeywords.es-CL': 'yerb',
          limit: 15,
          fuzzy: true,
          staged: true
        });
      });

      it('should return the suggestions response', () => {
        expect(response).toEqual({
          'searchKeywords.es-CL': [{ text: 'Yerba' }, { text: 'Mate' }]
        });
      });
    });
  });
});
