const mockCategoriesRepository = {
  getByKey: jest.fn((key: string) => {
    if (key.indexOf('MALFORMED') > 0) {
      return Promise.reject(new CommercetoolsError(queryCategoryError));
    }
    if (key.indexOf('TIMEOUT') > 0) {
      return Promise.reject(new CommercetoolsError(queryTimeoutError));
    }
    if (key.indexOf('NOT-EXISTS') > 0) {
      return Promise.reject(new CommercetoolsError(queryCategoryNotFoundError));
    }
    return Promise.resolve(categoriesMock[0]);
  }),
  find: jest.fn(({ queryArgs }: { queryArgs: { where: string } }) => {
    if (queryArgs) {
      if (queryArgs?.where?.indexOf('malformed') > 0) {
        return Promise.reject(new CommercetoolsError(queryCategoryError));
      }
      if (queryArgs?.where?.indexOf('timeout') > 0) {
        return Promise.reject(new CommercetoolsError(queryTimeoutError));
      }
      if (queryArgs?.where?.indexOf('not-exists') > 0) {
        return Promise.reject(new CommercetoolsError(queryCategoryNotFoundError));
      }
      if (queryArgs?.where?.indexOf('de16225f-47a6-46aa-9444-2dc2b7270ce2') > 0) {
        return Promise.resolve({ ...categoryPagedQueryResponseMock, count: 499 });
      }
    }
    return Promise.resolve(categoryPagedQueryResponseMock);
  })
};

jest.mock('commercetools-sdk-repositories', () => ({
  CategoriesRepository: jest.fn().mockImplementation(() => mockCategoriesRepository)
}));

const mockCategoriesService = {
  getByKey: jest.fn((key: string) => {
    if (key.indexOf('MALFORMED') > 0) {
      return Promise.reject(new CommercetoolsError(queryCategoryError));
    }
    if (key.indexOf('TIMEOUT') > 0) {
      return Promise.reject(new CommercetoolsError(queryTimeoutError));
    }
    if (key.indexOf('NOT-EXISTS') > 0) {
      return Promise.reject(new CommercetoolsError(queryCategoryNotFoundError));
    }
    if (key.indexOf('PAGING-ERROR') > 0) {
      return Promise.resolve({ ...categoriesMock[0], id: 'paging-error' });
    }
    return Promise.resolve(categoriesMock[0]);
  }),
  query: jest.fn((queryArgs: { where: string }) => {
    if (queryArgs) {
      if (queryArgs?.where?.indexOf('malformed') > 0) {
        return Promise.reject(new CommercetoolsError(queryCategoryError));
      }
      if (queryArgs?.where?.indexOf('timeout') > 0) {
        return Promise.reject(new CommercetoolsError(queryTimeoutError));
      }
      if (queryArgs?.where?.indexOf('not-exists') > 0) {
        return Promise.reject(new CommercetoolsError(queryCategoryNotFoundError));
      }
      if (queryArgs?.where?.indexOf('de16225f-47a6-46aa-9444-2dc2b7270ce2') > 0) {
        return Promise.resolve({ ...categoryPagedQueryResponseMock, count: 499 });
      }
      if (queryArgs?.where?.indexOf('paging-error') > 0) {
        return Promise.reject(new CommercetoolsError(queryTimeoutError));
      }
    }
    return Promise.resolve(categoryPagedQueryResponseMock);
  })
};

jest.mock('../categories.service', () => ({
  CategoriesService: jest.fn().mockImplementation(() => mockCategoriesService)
}));

import request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, INestApplication } from '@nestjs/common';
import { CategoriesService } from '../categories.service';
import { CategoriesController } from '../categories.controller';
import { CategoriesTreeService } from '../categories-tree.service';
import {
  categoriesMock,
  categoryPagedQueryResponseMock,
  categoryTreeResponse,
  queryCategoryError,
  queryCategoryNotFoundError,
  queryTimeoutError
} from '../__mocks__/categories.mock';
import { CategoriesRepository } from 'commercetools-sdk-repositories';
import { CommercetoolsError } from '@/nest-commercetools/errors';
import { CommercetoolsExceptionFilter } from '@/common/filters/commercetools.exception.filter';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { ApiErrorFilter } from '@/common/filters/api.exception.filter';

describe('Categories', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [CategoriesController],
      providers: [CategoriesTreeService, CategoriesService, CategoriesRepository]
    }).compile();
    app = module.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter()).useGlobalFilters(new CommercetoolsExceptionFilter()).useGlobalFilters(new ApiErrorFilter());
    await app.init();
  });

  describe('GET /categories', () => {
    const url = '/categories';

    it('should return a full list of categories', () => {
      return request(app.getHttpServer()).get(url).expect(200).expect(categoryPagedQueryResponseMock);
    });

    it('should throw an error from commercetools when query is invalid', () => {
      return request(app.getHttpServer())
        .get(`${url}?where=key("malformed")`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            `Malformed parameter: where: Syntax error while parsing 'where'. Unexpected end of input, expected SphereIdentifierChar, comparison operator, not, in, contains, is, within or matches (line 1, column 8):invalid`
          ]
        });
    });

    it('should throw an error from commercetools when query times out', () => {
      return request(app.getHttpServer())
        .get(`${url}?where=key("timeout")`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'The query timed out. If your query constantly times out, please check that it follows the performance best practices (see https://docs.commercetools.com/api/predicates/query#performance-considerations).'
          ]
        });
    });

    it('should throw an error from commercetools when category does not exist', () => {
      return request(app.getHttpServer()).get(`${url}?where=key("not-exists")`).expect(404).expect({ statusCode: 404, message: 'Not Found' });
    });
  });

  describe('GET /categories/tree', () => {
    const url = '/categories/tree';

    it('should return a category tree', () => {
      return request(app.getHttpServer()).get(`${url}?rootKey="C101"&childLevels=3`).expect(200).expect(categoryTreeResponse);
    });

    it('should throw an error when the requested cateogory does not exist', () => {
      return request(app.getHttpServer()).get(`${url}?rootKey="not-exists"&childLevels=3`).expect(404).expect({ statusCode: 404, message: 'Not Found' });
    });

    it('should throw an error when commercetools fails and handle for the exception filter', () => {
      return request(app.getHttpServer())
        .get(`${url}?rootKey="malformed"&childLevels=3`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            `Malformed parameter: where: Syntax error while parsing 'where'. Unexpected end of input, expected SphereIdentifierChar, comparison operator, not, in, contains, is, within or matches (line 1, column 8):invalid`
          ]
        });
    });

    it('should throw an error when commercetools times out', () => {
      return request(app.getHttpServer())
        .get(`${url}?rootKey="timeout"&childLevels=3`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'The query timed out. If your query constantly times out, please check that it follows the performance best practices (see https://docs.commercetools.com/api/predicates/query#performance-considerations).'
          ]
        });
    });

    it('should throw an error when paging fails', () => {
      return request(app.getHttpServer())
        .get(`${url}?rootKey="paging-error"&childLevels=3`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            'The query timed out. If your query constantly times out, please check that it follows the performance best practices (see https://docs.commercetools.com/api/predicates/query#performance-considerations).'
          ]
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
