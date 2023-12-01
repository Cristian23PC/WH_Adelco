import { categoryPagedQueryResponseMock, categoryTreeResponse } from '../__mocks__/categories.mock';

const mockCategoriesService = {
  query: jest.fn().mockImplementation((queryArgs?: queryArgsCt) => {
    const key = (<string>queryArgs.where[0]).split('="')[1].split('"')[0];

    if (key === 'invalidKey') {
      throw new Error('Commercetools error');
    } else if (key === 'noCategories') {
      return {
        ...categoryPagedQueryResponseMock,
        results: []
      };
    }

    return categoryPagedQueryResponseMock;
  })
};

const mockCategoriesTreeService = {
  getCategoriesTree: jest.fn().mockImplementation((query: GetCategoriesTreeQueryArgsDto) => {
    if (query.rootKey === 'INVALIDKEY') {
      throw new Error(`No category was found with the key of ${query.rootKey}`);
    }
    return categoryTreeResponse;
  })
};

jest.mock('../categories.service', () => ({
  CategoriesService: jest.fn().mockImplementation(() => mockCategoriesService)
}));

jest.mock('../categories-tree.service', () => ({
  CategoriesTreeService: jest.fn().mockImplementation(() => mockCategoriesTreeService)
}));

import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesTreeService } from '../categories-tree.service';
import { CategoriesService } from '../categories.service';
import { GetCategoriesQueryArgsDto, GetCategoriesTreeQueryArgsDto } from '../dto/queryargs.dto';
import { CategoryTree } from '../interfaces';
import { CacheModule } from '@nestjs/common';
import { queryArgsCt } from '../interfaces/categories.interface';
import { CategoryPagedQueryResponse } from '@commercetools/platform-sdk';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CategoriesController],
      providers: [CategoriesService, CategoriesTreeService]
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  describe('getCategories', () => {
    let response: CategoryPagedQueryResponse | Error;
    let query: GetCategoriesQueryArgsDto;

    describe('when requesting categories with valid query', () => {
      beforeEach(async () => {
        query = { where: ['key="valid"'] };
        response = await controller.getCategories(query);
      });

      it('should call CategoriesService.query', () => {
        expect(mockCategoriesService.query).toHaveBeenCalledWith(query);
      });

      it('should return expected response with categories', () => {
        expect(response).toEqual(categoryPagedQueryResponseMock);
      });
    });

    describe('when requesting categories and not find any category', () => {
      beforeEach(async () => {
        query = { where: ['key="noCategories"'] };
        response = await controller.getCategories(query);
      });

      it('should call CategoriesService.query', () => {
        expect(mockCategoriesService.query).toHaveBeenCalledWith(query);
      });

      it('should return expected response without categories', () => {
        expect(response).toEqual({ ...categoryPagedQueryResponseMock, results: [] });
      });
    });

    describe('when CategoriesService.query reject', () => {
      beforeEach(async () => {
        query = { where: ['key="invalidKey"'] };
        try {
          await controller.getCategories(query);
        } catch (error) {
          response = error as Error;
        }
      });

      it('should call CategoriesService.query', () => {
        expect(mockCategoriesService.query).toHaveBeenCalledWith(query);
      });

      it('should throw CategoriesService.query error', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });

  describe('getCategoriesTree', () => {
    let response: CategoryTree | Error;
    let query: GetCategoriesTreeQueryArgsDto;

    describe('when requesting categories tree with valid rootKey', () => {
      beforeEach(async () => {
        query = { rootKey: 'key', childLevels: '1' };
        response = await controller.getCategoriesTree(query);
      });

      it('should call CategoriesTreeService.getCategoriesTree', () => {
        const queryRequest = {
          rootKey: query.rootKey.toUpperCase(),
          childLevels: 1
        };
        expect(mockCategoriesTreeService.getCategoriesTree).toHaveBeenCalledWith(queryRequest);
      });

      it('should return expected response with categories tree', () => {
        expect(response).toEqual(categoryTreeResponse);
      });
    });

    describe('when requesting categories tree with valid rootKey and not exist', () => {
      beforeEach(async () => {
        query = { rootKey: 'invalidKey' };
        try {
          await controller.getCategoriesTree(query);
        } catch (error) {
          response = error as Error;
        }
      });

      it('should call CategoriesTreeService.getCategoriesTree', () => {
        const queryRequest = {
          rootKey: query.rootKey.toUpperCase(),
          childLevels: 0
        };
        expect(mockCategoriesTreeService.getCategoriesTree).toHaveBeenCalledWith(queryRequest);
      });

      it('should throw an error indicating the category not exist', () => {
        expect(response).toEqual(new Error(`No category was found with the key of ${query.rootKey.toUpperCase()}`));
      });
    });
  });
});
