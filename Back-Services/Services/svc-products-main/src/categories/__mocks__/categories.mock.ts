import { Category, CategoryPagedQueryResponse } from '@commercetools/platform-sdk';
import { CategoryTree } from '../interfaces';
import CategoriesMock from '../__test__/fixtures/CategoriesMock.json';

export const categoriesMock = CategoriesMock as Category[];

export const categoryPagedQueryResponseMock: CategoryPagedQueryResponse = {
  limit: 500,
  offset: 0,
  count: 500,
  total: 3,
  results: categoriesMock
};

export const categoryTreeResponse: CategoryTree = {
  ...categoriesMock[0],
  children: [
    {
      ...categoriesMock[1],
      children: [categoriesMock[2]]
    }
  ]
};

export const queryCategoryError = {
  statusCode: 400,
  message: `Malformed parameter: where: Syntax error while parsing 'where'. Unexpected end of input, expected SphereIdentifierChar, comparison operator, not, in, contains, is, within or matches (line 1, column 8):invalid`,
  errors: [
    {
      code: 'InvalidInput',
      message: `Malformed parameter: where: Syntax error while parsing 'where'. Unexpected end of input, expected SphereIdentifierChar, comparison operator, not, in, contains, is, within or matches (line 1, column 8):invalid`
    }
  ]
};

export const queryTimeoutError = {
  statusCode: 400,
  message:
    'The query timed out. If your query constantly times out, please check that it follows the performance best practices (see https://docs.commercetools.com/api/predicates/query#performance-considerations).',
  errors: [
    {
      code: 'QueryTimedOut',
      message:
        'The query timed out. If your query constantly times out, please check that it follows the performance best practices (see https://docs.commercetools.com/api/predicates/query#performance-considerations).'
    }
  ]
};

export const queryCategoryNotFoundError = {
  statusCode: 404,
  message: `The Resource with ID '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b2' was not found.`,
  errors: [
    {
      code: 'ResourceNotFound',
      message: `The Resource with ID '9ed85eeb-58d4-45aa-b464-7d55f3f9d6b2' was not found.`
    }
  ]
};
