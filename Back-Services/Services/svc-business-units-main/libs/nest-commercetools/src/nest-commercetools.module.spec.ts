const mockNestCommercetoolsCoreModule = {
  forRoot: jest.fn(() => 'foo'),
  forRootAsync: jest.fn(() => 'foo'),
};

jest.mock('./nest-commercetools-core.module', () => ({
  NestCommercetoolsCoreModule: mockNestCommercetoolsCoreModule,
}));

const mockCreateNestCommercetoolsProviders = jest.fn(() => 'foo');

jest.mock('./nest-commercetools.providers', () => ({
  createNestCommercetoolsProviders: mockCreateNestCommercetoolsProviders,
}));

import { NestCommercetoolsModule } from './nest-commercetools.module';

describe('Nest commercetools module', () => {
  describe('forRoot', () => {
    let options: any;
    let response;
    let expectedResponse;

    beforeAll(() => {
      options = {};
      expectedResponse = {
        module: NestCommercetoolsModule,
        imports: ['foo'],
      };
    });

    beforeEach(() => {
      response = NestCommercetoolsModule.forRoot(options);
    });

    test('should call getByProjectKeyRequestBuilder', () => {
      expect(mockNestCommercetoolsCoreModule.forRoot).toHaveBeenCalledWith(
        options,
      );
    });

    test('should return expected response', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('forRootAsync', () => {
    let options: any;
    let response;
    let expectedResponse;

    beforeAll(() => {
      options = {};
      expectedResponse = {
        module: NestCommercetoolsModule,
        imports: ['foo'],
      };
    });

    beforeEach(() => {
      response = NestCommercetoolsModule.forRootAsync(options);
    });

    test('should call NestCommercetoolsCoreModule.forRootAsync with options', () => {
      expect(mockNestCommercetoolsCoreModule.forRootAsync).toHaveBeenCalledWith(
        options,
      );
    });

    test('should return expected response', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('forFeature', () => {
    let repositories: any[];
    let response;
    let expectedResponse;

    beforeAll(() => {
      repositories = [];
      expectedResponse = {
        module: NestCommercetoolsModule,
        providers: 'foo',
        exports: 'foo',
      };
    });

    beforeEach(() => {
      response = NestCommercetoolsModule.forFeature(repositories);
    });

    test('should call createNestCommercetoolsProviders', () => {
      expect(mockCreateNestCommercetoolsProviders).toHaveBeenCalledWith(
        repositories,
      );
    });

    test('should return expected response', () => {
      expect(response).toEqual(expectedResponse);
    });
  });
});
