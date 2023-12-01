import { categoriesMock, categoryPagedQueryResponseMock } from '../__mocks__/categories.mock';
import { CommercetoolsError } from '@/nest-commercetools/errors';

const mockCategoriesRepository = {
  getByKey: jest.fn((key: string) =>
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
      : Promise.resolve(categoriesMock)
  ),
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string } }) => {
    const categoryId = queryArgs.where.split('="')[1].split('")')[0];
    return categoryId === 'error' ? Promise.reject(new Error('Commercetools error')) : Promise.resolve(categoryPagedQueryResponseMock);
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CategoriesRepository: jest.fn().mockImplementation(() => mockCategoriesRepository)
}));

const mockConfigService = {
  get: (key: string) => key
};

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => mockConfigService)
}));

import { Category, CategoryPagedQueryResponse } from '@commercetools/platform-sdk';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CategoriesRepository } from 'commercetools-sdk-repositories';
import { CategoriesService } from '../categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriesService, CategoriesRepository, ConfigService]
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  describe('getByKey', () => {
    let response: Error | Category | CategoryPagedQueryResponse;
    let categoryKey: string;

    describe('when categoriesRepository.getByKey succeeds', () => {
      beforeEach(async () => {
        categoryKey = 'key';
        response = await service.getByKey(categoryKey);
      });

      it('should call categoriesRepository.getByKey', () => {
        expect(mockCategoriesRepository.getByKey).toHaveBeenCalledWith(categoryKey);
      });

      it('should return categoriesRepository.getByKey response', () => {
        expect(response).toEqual(categoriesMock);
      });
    });

    describe('when categoriesRepository.getByKey rejects', () => {
      const expectedResponse = new CommercetoolsError({
        body: {
          statusCode: 404,
          message: `The Resource with key 'error' was not found.`,
          errors: []
        }
      });
      beforeEach(async () => {
        categoryKey = 'error';
        try {
          await service.getByKey(categoryKey);
        } catch (error) {
          response = error as CommercetoolsError;
        }
      });

      it('should call categoriesRepository.getByKey', () => {
        expect(mockCategoriesRepository.getByKey).toHaveBeenCalledWith(categoryKey);
      });

      it('should throw categoriesRepository.getByKey error', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('query', () => {
    let response: Error | Category | CategoryPagedQueryResponse;
    let categoryId: string;

    describe('when categoriesRepository.find succeeds', () => {
      beforeEach(async () => {
        categoryId = 'id';
        response = await service.query({
          where: `ancestors(id="${categoryId}")`,
          limit: 500
        });
      });

      it('should call categoriesRepository.find', () => {
        const queryArgs = {
          queryArgs: { limit: 500, where: `ancestors(id="${categoryId}")` }
        };
        expect(mockCategoriesRepository.find).toHaveBeenCalledWith(queryArgs);
      });

      it('should return categoriesRepository.find response', () => {
        expect(response).toEqual(categoryPagedQueryResponseMock);
      });
    });

    describe('when categoriesRepository.find rejects', () => {
      beforeEach(async () => {
        categoryId = 'error';
        try {
          await service.query({
            where: `ancestors(id="${categoryId}")`,
            limit: 500
          });
        } catch (error) {
          response = error as Error;
        }
      });

      it('should call categoriesRepository.query', () => {
        const queryArgs = {
          queryArgs: { limit: 500, where: `ancestors(id="${categoryId}")` }
        };
        expect(mockCategoriesRepository.find).toHaveBeenCalledWith(queryArgs);
      });

      it('should throw categoriesRepository.query error', () => {
        expect(response).toEqual(new Error('Commercetools error'));
      });
    });
  });
});
