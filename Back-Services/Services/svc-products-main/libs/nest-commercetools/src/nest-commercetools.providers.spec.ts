const NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER =
  'ByProjectKeyRequestBuilder';
jest.mock('./nest-commercetools.constants', () => ({
  NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
}));

import { createNestCommercetoolsProviders } from './nest-commercetools.providers';

class Repository {
  byProjectKeyRequestBuilder: any;

  constructor(byProjectKeyRequestBuilder: any) {
    this.byProjectKeyRequestBuilder = byProjectKeyRequestBuilder;
  }
}

describe('Nest commercetools providers', () => {
  describe('createNestCommercetoolsProviders', () => {
    let repositories: any[];
    let response;

    describe('when no repositories', () => {
      beforeEach(() => {
        response = createNestCommercetoolsProviders();
      });

      test('should return an empty array', () => {
        expect(response).toHaveLength(0);
      });
    });

    describe('when empty repositories', () => {
      beforeAll(() => {
        repositories = [];
      });

      beforeEach(() => {
        response = createNestCommercetoolsProviders(repositories);
      });

      test('should return an empty array', () => {
        expect(response).toHaveLength(0);
      });
    });

    describe('when repositories', () => {
      beforeAll(() => {
        repositories = [Repository];
      });

      beforeEach(() => {
        response = createNestCommercetoolsProviders(repositories);
      });

      test('should return providers array', () => {
        expect(response).toHaveLength(1);
      });

      test('each provider should have provide property', () => {
        expect(response[0]).toHaveProperty('provide', Repository);
      });

      test('each provider should have useFactory property', () => {
        expect(response[0]).toHaveProperty('useFactory');
      });

      test('each provider should have inject property', () => {
        expect(response[0]).toHaveProperty('inject', [
          NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
        ]);
      });
    });
  });
});
