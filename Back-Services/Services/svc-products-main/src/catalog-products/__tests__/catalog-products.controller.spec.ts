const mockCatalogProductsService = {
  getProductsWithPrices: jest.fn().mockImplementation((query: { dch?: string; t2z?: string }) => {
    let response: {
      limit: number;
      offset: number;
      count: number;
      total: number;
      results: [{ id: string; calculatedPrice?: object }];
    } = {
      limit: 20,
      offset: 0,
      count: 1,
      total: 1,
      results: [{ id: 'id' }]
    };
    if (!query.dch || query.dch === 'invalidChannel') {
      throw new Error('Invalid distribution channel');
    } else if (query.t2z === 'nonMatchingT2') {
      throw new Error('T2 zone does not match distribution center');
    } else if (query.t2z === 'validT2') {
      response = {
        ...response,
        results: [{ ...response.results[0], calculatedPrice: {} }]
      };
    }
    return response;
  }),
  getProductsByCategorySlug: jest.fn(),
  getProductSuggestions: jest.fn(() => Promise.resolve({ 'searchKeywords.es-CL': [{ text: 'Yerb' }, { text: 'Mate' }] }))
};

jest.mock('../catalog-products.service', () => ({
  CatalogProductsService: jest.fn().mockImplementation(() => mockCatalogProductsService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { CatalogProductsController } from '../catalog-products.controller';
import { CatalogProductsService } from '../catalog-products.service';
import { QueryArgsDto } from '../../products/dto/queryargs.dto';
import { ProductSuggestionsRequestDto } from '@/products/dto/productSuggestionsRequest.dto';

describe('ProductsController', () => {
  let controller: CatalogProductsController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogProductsController],
      providers: [CatalogProductsService]
    }).compile();

    controller = module.get<CatalogProductsController>(CatalogProductsController);
  });

  describe('getProducts', () => {
    let query: QueryArgsDto;
    let response;

    describe('when requesting products with valid channel and T2', () => {
      beforeAll(() => {
        query = { dch: 'validChannel', t2z: 'validT2' };
      });

      beforeEach(async () => {
        response = await controller.getProducts(query);
      });

      it('should call CatalogProductsService.getProductsWithPrices', () => {
        expect(mockCatalogProductsService.getProductsWithPrices).toHaveBeenCalledWith(query);
      });

      it('should return expected response with products and calculated prices', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.results[0].calculatedPrice).not.toBeUndefined();
      });
    });

    describe('when requesting products with valid channel and not supplying T2', () => {
      beforeAll(() => {
        query = { dch: 'validChannel' };
      });

      beforeEach(async () => {
        response = await controller.getProducts(query);
      });

      it('should call CatalogProductsService.getProductsWithPrices', () => {
        expect(mockCatalogProductsService.getProductsWithPrices).toHaveBeenCalledWith(query);
      });

      it('should return expected response with products without prices', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.results[0].calculatedPrice).toBeUndefined();
      });
    });

    describe('when requesting products with valid channel and a T2 that does not exist', () => {
      beforeAll(() => {
        query = { dch: 'validChannel', t2z: 'invalidT2' };
      });

      beforeEach(async () => {
        response = await controller.getProducts(query);
      });

      it('should call CatalogProductsService.getProductsWithPrices', () => {
        expect(mockCatalogProductsService.getProductsWithPrices).toHaveBeenCalledWith(query);
      });

      it('should return expected response with products without prices', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.results[0].calculatedPrice).toBeUndefined();
      });
    });

    describe('when requesting products with valid channel and T2', () => {
      beforeAll(() => {
        query = {
          dch: 'validChannel',
          t2z: 'validT2',
          'text.es-CL': 'searchKey'
        };
      });

      beforeEach(async () => {
        response = await controller.getProducts(query);
      });

      it('should call CatalogProductsService.getProductsWithPrices', () => {
        expect(mockCatalogProductsService.getProductsWithPrices).toHaveBeenCalledWith(query);
      });

      it('should return expected response with products and calculated prices', () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        expect(response.results[0].calculatedPrice).not.toBeUndefined();
      });
    });

    describe('when requesting products with invalid channel', () => {
      let error: Error;
      beforeAll(() => {
        query = { dch: 'invalidChannel' };
      });

      beforeEach(async () => {
        try {
          await controller.getProducts(query);
        } catch (e) {
          error = e as Error;
        }
      });

      it('should call CatalogProductsService.getProductsWithPrices', () => {
        expect(mockCatalogProductsService.getProductsWithPrices).toHaveBeenCalledWith(query);
      });

      it('should throw an error indicating the channel is invalid', () => {
        expect(error).toEqual(new Error('Invalid distribution channel'));
      });
    });

    describe('when requesting products with non matching T2 for channel', () => {
      let error: Error;
      beforeAll(() => {
        query = { dch: 'validChannel', t2z: 'nonMatchingT2' };
      });

      beforeEach(async () => {
        try {
          await controller.getProducts(query);
        } catch (e) {
          error = e as Error;
        }
      });

      it('should call CatalogProductsService.getProductsWithPrices', () => {
        expect(mockCatalogProductsService.getProductsWithPrices).toHaveBeenCalledWith(query);
      });

      it('should throw an error indicating the T2 does not match channel', () => {
        expect(error).toEqual(new Error('T2 zone does not match distribution center'));
      });
    });
  });

  describe('getProductsByCategorySlug', () => {
    let query: QueryArgsDto;

    describe('when requesting products with category slug valid', () => {
      beforeEach(async () => {
        await controller.getProductsByCategory('categorySlug', query);
      });

      it('should call CatalogProductsService.getPorductsByCategorySlug', () => {
        expect(mockCatalogProductsService.getProductsByCategorySlug).toHaveBeenCalledWith('categorySlug', query);
      });
    });
  });

  describe('getProductSuggestions', () => {
    let query: ProductSuggestionsRequestDto;

    describe('when requesting products suggestions', () => {
      beforeEach(async () => {
        query = {
          'searchKeywords.es-CL': 'yerb',
          limit: 15,
          fuzzy: true,
          staged: true
        };
        await controller.getProductSuggestions(query);
      });

      it('should call CatalogProductsService.getProductSuggestions', () => {
        expect(mockCatalogProductsService.getProductSuggestions).toHaveBeenCalledWith(query);
      });
    });
  });
});
