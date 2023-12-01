const mockProductProjectionsRepository = {
  search: jest.fn((methodArgs: { queryArgs: { limit } }) =>
    methodArgs.queryArgs.limit === 111
      ? Promise.reject(new Error('Commercetools error'))
      : Promise.resolve({
          limit: 20,
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
        })
  ),
  suggest: jest.fn((methodArgs: { queryArgs: { 'searchKeywords.es-CL': string } }) => {
    switch (methodArgs.queryArgs['searchKeywords.es-CL']) {
      case 'error':
        return Promise.reject(new Error('Commercetools error'));
      case 'no-match':
        return Promise.resolve({ 'searchKeywords.es-CL': [] });
      default:
        return Promise.resolve({
          'searchKeywords.es-CL': [{ text: 'Yerba' }, { text: 'Mate' }]
        });
    }
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  ProductProjectionsRepository: jest.fn().mockImplementation(() => mockProductProjectionsRepository)
}));

const mockConfigService = {
  get: (key: string) => {
    switch (key) {
      case 'products.fuzzyThresholdLength': {
        return 5;
      }
      default: {
        return key;
      }
    }
  }
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

const mockDistributionCenterssService = {
  getByKey: jest.fn(key => {
    const id = key === 'PM' ? 'pm-id' : 'default-supply-channel-id';

    return Promise.resolve({ key, id });
  })
};

jest.mock('@/distribution-centers/distribution-centers.service', () => ({ DistributionCentersService: jest.fn().mockImplementation(() => mockDistributionCenterssService) }));

const mockConvertProduct = jest.fn(x => x);

jest.mock('../converters', () => ({ convertProduct: mockConvertProduct }));

import { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductProjectionsRepository } from 'commercetools-sdk-repositories';
import { ProductsService } from '../products.service';
import { DistributionCentersService } from '@/distribution-centers/distribution-centers.service';
import { QueryArgsDto } from '../dto/queryargs.dto';
import { ProductSuggestionsResponseDto } from '@/catalog-products/dto/productSuggestionsResponse.dto';
import { ProductSuggestionsRequestDto } from '../dto/productSuggestionsRequest.dto';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService, ProductProjectionsRepository, ConfigService, DistributionCentersService]
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('getProducts', () => {
    let response: Error | ProductProjectionPagedSearchResponse;
    let supplyChannelKey: string;
    const defaultQueryArgs = {
      expand: ['taxCategory', 'masterVariant.price.discounted.discount'],
      'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"products.defaultSupplyChannel"'],
      limit: 20,
      offset: 0,
      sort: ['variants.attributes.sortingPriority desc', 'createdAt desc']
    };
    const defaultQueryArgsForPrices = {
      priceCurrency: 'products.priceCurrency',
      priceCountry: 'products.priceCountry'
    };

    describe('when productProjectionsRepository.search succeeds', () => {
      let expectedResponse;

      beforeAll(() => {
        expectedResponse = {
          limit: 20,
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
        };
      });

      describe('when queryArgs provided and using default supplyChannel', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            limit: 10,
            offset: 1
          };
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: { ...defaultQueryArgs, ...queryArgs }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when supply channel is provided without t2 zone', () => {
        beforeAll(() => {
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey);
        });

        it('should call productProjectionsRepository.search for requested distribution center without price info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a distribution channel and t2 zone are provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId'
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a filter is provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            filter: 'filterby:"key"'
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              filter: ['filterby:"key"'],
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when multiple filters are provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            filter: ['field:"key"', 'anotherField:"key2"']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              filter: ['field:"key"', 'anotherField:"key2"'],
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
      describe('when an availability filter is provided with isOnStock value as a true', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            filter: ['masterVariant.availability.isOnStock=true']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              filter: ['variants.availability.channels.pm-id.isOnStock:true'],
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when an availability filter is provided with isOnStock with false value', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            filter: ['masterVariant.availability.isOnStock=false']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              filter: ['variants.availability.channels.pm-id.isOnStock:false'],
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
      describe('when a filter query is provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            'filter.query': ['filterBy:"key"']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"', 'filterBy:"key"']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when multiple filter queries are provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            'filter.query': ['field:"key"', 'anotherField:"key2"']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"', 'field:"key"', 'anotherField:"key2"']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a filter facet is provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            'filter.facets': ['facet']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"'],
              'filter.facets': ['facet']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when multiple filter facets are provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            'filter.facets': ['facet', 'anotherFacet']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"'],
              'filter.facets': ['facet', 'anotherFacet']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a facet is provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            facet: ['facet']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"'],
              facet: ['facet']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when multiple facets are provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            facet: ['facet', 'anotherFacet']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search for requested distribution center and include price channel info', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"'],
              facet: ['facet', 'anotherFacet']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when queryArgs, channel and t2 zone are not provided', () => {
        beforeEach(async () => {
          response = await service.getProducts(undefined);
        });

        it('should call productProjectionsRepository.search without price info and for default distribution center', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: defaultQueryArgs
          });
        });

        it('should return productProjectionsRepository.search with products', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a search text is provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            'text.es-CL': 'searchKey'
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search with dist center, channel, and text to search for', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"'],
              fuzzy: true,
              'text.es-CL': 'searchKey',
              sort: ['score desc', 'createdAt desc']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a search text is provided and the text length is greater than 5', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            'text.es-CL': 'moreThanFive'
          };
        });

        beforeEach(async () => {
          response = await service.getProducts(undefined, queryArgs);
        });

        it('should return fuzzy in true', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith(
            expect.objectContaining({
              queryArgs: expect.objectContaining({
                fuzzy: true
              })
            })
          );
        });
      });

      describe('when a search text is provided and the text length is less than 5', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            'text.es-CL': 'less'
          };
        });

        beforeEach(async () => {
          response = await service.getProducts(undefined, queryArgs);
        });

        it('should return fuzzy in false', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith(
            expect.objectContaining({
              queryArgs: expect.objectContaining({
                fuzzy: false
              })
            })
          );
        });
      });

      describe('when a search text is provided along with sorting criteria', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            'text.es-CL': 'searchKey',
            sort: ['variants.attributes.price.centAmount asc']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search with sorting criteria', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"'],
              fuzzy: true,
              'text.es-CL': 'searchKey',
              sort: ['variants.attributes.price.centAmount asc', 'score desc', 'createdAt desc']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when a sorting criteria is provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            sort: ['variants.attributes.price.centAmount asc']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search with sorting criteria', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"'],
              sort: ['variants.attributes.price.centAmount asc', 'variants.attributes.sortingPriority desc', 'createdAt desc']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when multiple sorting criteria are provided', () => {
        let queryArgs: QueryArgsDto;

        beforeAll(() => {
          queryArgs = {
            t2z: 't2zone',
            dch: 'distChannelId',
            'filter.query': ['field:"key"', 'anotherField:"key2"'],
            sort: ['variants.sku asc', 'variants.attributes.price.centAmount asc']
          };
          supplyChannelKey = 'PM';
        });

        beforeEach(async () => {
          response = await service.getProducts(supplyChannelKey, queryArgs);
        });

        it('should call productProjectionsRepository.search with sorting criteria', () => {
          expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
            queryArgs: {
              ...defaultQueryArgs,
              ...defaultQueryArgsForPrices,
              priceChannel: 'distChannelId',
              'filter.query': ['variants.attributes.enabledForDistributionCenters.key:"PM"', 'field:"key"', 'anotherField:"key2"'],
              sort: ['variants.sku asc', 'variants.attributes.price.centAmount asc', 'variants.attributes.sortingPriority desc', 'createdAt desc']
            }
          });
        });

        it('should return productProjectionsRepository.search response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });

    describe('when productProjectionsRepository.search rejects', () => {
      let queryArgs: QueryArgsDto;
      let error: Error;

      beforeAll(() => {
        queryArgs = {
          limit: 111
        };
      });

      beforeEach(async () => {
        try {
          response = await service.getProducts(undefined, queryArgs);
        } catch (e) {
          error = e as Error;
        }
      });

      it('should call productProjectionsRepository.search', () => {
        expect(mockProductProjectionsRepository.search).toHaveBeenCalledWith({
          queryArgs: { ...defaultQueryArgs, ...queryArgs }
        });
      });

      it('should throw productProjectionsRepository.search error', () => {
        expect(error).toEqual(new Error('Commercetools error'));
      });
    });
  });

  describe('getSuggestions', () => {
    let response: Error | Partial<ProductSuggestionsResponseDto>;
    let queryArgs: ProductSuggestionsRequestDto;
    describe('when call succeeds', () => {
      describe('when no matching keywords are returned', () => {
        beforeAll(() => {
          queryArgs = {
            'searchKeywords.es-CL': 'no-match'
          };
        });

        beforeEach(async () => {
          response = await service.getSuggestions(queryArgs);
        });

        it('should call productProjectionsRepository.suggest', () => {
          expect(mockProductProjectionsRepository.suggest).toHaveBeenCalledWith({
            queryArgs
          });
        });

        it('should return productProjectionsRepository.suggest response', () => {
          expect(response).toEqual({ 'searchKeywords.es-CL': [] });
        });
      });

      describe('when matching keywords are returned', () => {
        beforeAll(() => {
          queryArgs = {
            'searchKeywords.es-CL': 'yerb',
            limit: 20,
            fuzzy: true,
            staged: true
          };
        });

        beforeEach(async () => {
          response = await service.getSuggestions(queryArgs);
        });

        it('should call productProjectionsRepository.suggest', () => {
          expect(mockProductProjectionsRepository.suggest).toHaveBeenCalledWith({
            queryArgs
          });
        });

        it('should return productProjectionsRepository.suggest response', () => {
          expect(response).toEqual({ 'searchKeywords.es-CL': [{ text: 'Yerba' }, { text: 'Mate' }] });
        });
      });
    });

    describe('when an error occurs in Commercetools', () => {
      beforeAll(() => {
        queryArgs = {
          'searchKeywords.es-CL': 'error',
          limit: 20,
          fuzzy: true,
          staged: true
        };
      });

      beforeEach(async () => {
        try {
          await service.getSuggestions(queryArgs);
        } catch (e) {
          response = e;
        }
      });

      it('should call productProjectionsRepository.suggest', () => {
        expect(mockProductProjectionsRepository.suggest).toHaveBeenCalledWith({
          queryArgs
        });
      });

      it('should return an error', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });
});
