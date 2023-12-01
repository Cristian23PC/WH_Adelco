import { categoriesMock, categoryPagedQueryResponseMock, categoryTreeResponse } from '../__mocks__/categories.mock';

const mockCategoriesService = {
  getByKey: jest.fn().mockImplementation((key: string) =>
    key === 'error'
      ? Promise.reject(
          new CommercetoolsError({
            body: {
              statusCode: 404,
              message: `The Resource with key '${key}' was not found.`,
              errors: []
            }
          })
        )
      : Promise.resolve(categoriesMock[0])
  ),
  query: jest.fn().mockImplementation((queryArgs: queryArgsCt) => {
    const categoryId = (<string>queryArgs.where).split('="')[1].split('")')[0];
    const lastId = (<string>queryArgs.where)?.split('>"')[1]?.split('"')[0];

    if (categoryId === 'noChildren') {
      return Promise.resolve({
        ...categoryPagedQueryResponseMock,
        results: []
      });
    } else if (categoryId === 'error' || lastId === 'error') {
      throw new CommercetoolsError({
        body: {
          statusCode: 404,
          message: `The Resource with key 'error' was not found.`,
          errors: []
        }
      });
    } else if (lastId === '0c4c2eb0-ac8f-46c2-96c6-c3dee345bd4f') {
      return Promise.resolve({ ...categoryPagedQueryResponseMock, count: 499 });
    }

    return Promise.resolve(categoryPagedQueryResponseMock);
  })
};

const mockCategoriesTreeBuilder = {
  categoriesTreeBuilder: jest.fn().mockImplementation((category: Category, categories: Category[], childLevels: number) => {
    if (childLevels === 2) {
      return {
        ...categoriesMock[0],
        children: [categoriesMock[1]]
      };
    } else if (childLevels === 3) {
      return categoryTreeResponse;
    }

    return { ...category, children: [] };
  })
};

jest.mock('../categories.service', () => ({
  CategoriesService: jest.fn().mockImplementation(() => mockCategoriesService)
}));

jest.mock('../helpers/categories-tree/categories-tree-builder.helper', () => mockCategoriesTreeBuilder);

import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesTreeService } from '../categories-tree.service';
import { CategoriesService } from '../categories.service';
import { Category } from '@commercetools/platform-sdk';
import { CategoryTree } from '../interfaces';
import { GetCategoriesTreeQueryArgsDto } from '../dto/queryargs.dto';
import { ConfigService } from '@nestjs/config';
import { queryArgsCt } from '../interfaces/categories.interface';
import { CommercetoolsError } from '@/nest-commercetools/errors';

describe('CategoriesTreeService', () => {
  let service: CategoriesTreeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesTreeService, CategoriesService, ConfigService]
    }).compile();

    service = module.get<CategoriesTreeService>(CategoriesTreeService);
  });

  describe('getCategoriesTree', () => {
    let response: CategoryTree | Error;
    let query: GetCategoriesTreeQueryArgsDto;

    describe('when requesting categories tree with one childLevel', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'getCategoriesByPages').mockImplementation(() => Promise.resolve([]));
        query = { rootKey: 'key', childLevels: 1 };
        response = await service.getCategoriesTree(query);
      });

      it('should call categoriesService.getByKey', () => {
        expect(mockCategoriesService.getByKey).toHaveBeenCalledWith(query.rootKey);
      });

      it('should return expected response with categories tree without children', () => {
        expect(response).toEqual({ ...categoriesMock[0], children: [] });
      });
    });

    describe('when requesting categories tree with two childLevel', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'getCategoriesByPages').mockImplementation(() => Promise.resolve(categoriesMock));
        query = { rootKey: 'key', childLevels: 2 };
        response = await service.getCategoriesTree(query);
      });

      it('should call categoriesService.getByKey', () => {
        expect(mockCategoriesService.getByKey).toHaveBeenCalledWith(query.rootKey);
      });

      it('should return expected response with categories tree', () => {
        expect(response).toEqual({
          ...categoriesMock[0],
          children: [categoriesMock[1]]
        });
      });
    });

    describe('when requesting categories tree with three childLevel', () => {
      beforeEach(async () => {
        jest.spyOn(service, 'getCategoriesByPages').mockImplementation(() => Promise.resolve(categoriesMock));
        query = { rootKey: 'key', childLevels: 3 };
        response = await service.getCategoriesTree(query);
      });

      it('should call categoriesService.getByKey', () => {
        expect(mockCategoriesService.getByKey).toHaveBeenCalledWith(query.rootKey);
      });

      it('should return expected response with categories tree', () => {
        expect(response).toEqual(categoryTreeResponse);
      });
    });

    describe('when requesting categories with invalid root', () => {
      const expectedResponse = new CommercetoolsError({
        body: {
          statusCode: 404,
          message: `The Resource with key 'error' was not found.`,
          errors: []
        }
      });
      beforeEach(async () => {
        jest.spyOn(service, 'getCategoriesByPages').mockImplementation(() => Promise.resolve([]));
        query = { rootKey: 'error', childLevels: 1 };
        try {
          await service.getCategoriesTree(query);
        } catch (error) {
          response = error as CommercetoolsError;
        }
      });

      it('should call categoriesService.getByKey', () => {
        expect(mockCategoriesService.getByKey).toHaveBeenCalledWith(query.rootKey);
      });

      it('should return error response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
  });

  describe('getCategoriesByPages', () => {
    let response: Category[] | CommercetoolsError;

    describe('should iterate through all pages of categories recursively', () => {
      beforeEach(async () => {
        response = await service.getCategoriesByPages(categoriesMock[0], []);
      });

      it('Should call the categories service query method twice when iterating through all pages of categories recursively', () => {
        expect(mockCategoriesService.query).toHaveBeenCalledTimes(2);
      });

      it('Should return all categories retrieved when fetching categories recursively', () => {
        expect(response).toEqual([...categoriesMock, ...categoriesMock]);
      });
    });

    describe('should handle errors', () => {
      const expectedResponse = new CommercetoolsError({
        body: {
          statusCode: 404,
          message: `The Resource with key 'error' was not found.`,
          errors: []
        }
      });
      beforeEach(async () => {
        try {
          await service.getCategoriesByPages({ ...categoriesMock[0], id: 'error' }, []);
        } catch (error) {
          response = error as CommercetoolsError;
        }
      });

      it('Should call the categories service query method once for the initial query when fetching categories', () => {
        expect(mockCategoriesService.query).toHaveBeenCalledTimes(1);
      });

      it('Should throw an error when categories fetching encounters an error', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
