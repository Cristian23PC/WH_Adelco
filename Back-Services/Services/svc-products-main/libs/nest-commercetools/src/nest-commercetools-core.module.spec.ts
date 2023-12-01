const mockGetByProjectKeyRequestBuilder = jest.fn(() => 'foo');
jest.mock('./get-by-project-key-request-builder', () => ({
  __esModule: true,
  default: mockGetByProjectKeyRequestBuilder
}));

const NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER =
  'ByProjectKeyRequestBuilder';
const NEST_COMMERCETOOLS_MODULE_OPTIONS = 'NestCommercetoolsModuleOptions';
jest.mock('./nest-commercetools.constants', () => ({
  NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
  NEST_COMMERCETOOLS_MODULE_OPTIONS,
}));

import { NestCommercetoolsCoreModule } from './nest-commercetools-core.module';

describe('Nest commercetools core module', () => {
  describe('forRoot', () => {
    let options: any;
    let response;
    let expectedResponse;

    beforeAll(() => {
      options = {};
      expectedResponse = {
        module: NestCommercetoolsCoreModule,
        providers: [
          {
            provide: NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
            useValue: 'foo',
          },
        ],
        exports: [
          {
            provide: NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
            useValue: 'foo',
          },
        ],
      };
    });

    beforeEach(() => {
      response = NestCommercetoolsCoreModule.forRoot(options);
    });

    test('should call getByProjectKeyRequestBuilder', () => {
      expect(mockGetByProjectKeyRequestBuilder).toHaveBeenCalledWith(options);
    });

    test('should return expected response', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('forRootAsync', () => {
    let options: any;

    let mockCreateAsyncProviders;

    let response;
    let expectedResponse;

    beforeAll(() => {
      options = { imports: ['imports'] };
      expectedResponse = {
        module: NestCommercetoolsCoreModule,
        imports: options.imports,
        providers: [
          { provide: 'asyncProvide' },
          {
            provide: NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
            useFactory: async () => 'foo',
            inject: [NEST_COMMERCETOOLS_MODULE_OPTIONS],
          },
        ],
        exports: [
          {
            provide: NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
            useFactory: async () => 'foo',
            inject: [NEST_COMMERCETOOLS_MODULE_OPTIONS],
          },
        ],
      };
    });

    beforeEach(() => {
      mockCreateAsyncProviders = jest
        .spyOn(NestCommercetoolsCoreModule as any, 'createAsyncProviders')
        .mockReturnValueOnce([{ provide: 'asyncProvide' }]);
      response = NestCommercetoolsCoreModule.forRootAsync(options);
    });

    test('should call NestCommercetoolsCoreModule.createAsyncProviders with options', () => {
      expect(mockCreateAsyncProviders).toHaveBeenCalledWith(options);
    });

    test('should return expected response', () => {
      expect(JSON.stringify(response)).toEqual(
        JSON.stringify(expectedResponse),
      );
    });
  });

  describe('createAsyncProviders', () => {
    let options: any;

    let mockCreateAsyncOptionsProvider;

    let response;
    let expectedResponse;

    beforeEach(() => {
      mockCreateAsyncOptionsProvider = jest
        .spyOn(NestCommercetoolsCoreModule as any, 'createAsyncOptionsProvider')
        .mockReturnValueOnce({ provide: 'asyncProvide' });
    });

    describe('when options includes useExisting', () => {
      beforeAll(() => {
        options = { useExisting: true };
        expectedResponse = [{ provide: 'asyncProvide' }];
      });

      beforeEach(() => {
        response = (<any>NestCommercetoolsCoreModule).createAsyncProviders(
          options,
        );
      });

      test('should call NestCommercetoolsCoreModule.createAsyncOptionsProvider', () => {
        expect(mockCreateAsyncOptionsProvider).toHaveBeenCalledWith(options);
      });

      test('should return expected response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });

    describe('when options includes useFactory', () => {
      beforeAll(() => {
        options = { useFactory: true };
        expectedResponse = [{ provide: 'asyncProvide' }];
      });

      beforeEach(() => {
        response = (<any>NestCommercetoolsCoreModule).createAsyncProviders(
          options,
        );
      });

      test('should call NestCommercetoolsCoreModule.createAsyncOptionsProvider', () => {
        expect(mockCreateAsyncOptionsProvider).toHaveBeenCalledWith(options);
      });

      test('should return expected response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });

    describe('when options does not includes useExisting or useFactory', () => {
      beforeAll(() => {
        options = { useClass: true };
        expectedResponse = [
          { provide: 'asyncProvide' },
          {
            provide: options.useClass,
            useClass: options.useClass,
          },
        ];
      });

      beforeEach(() => {
        response = (<any>NestCommercetoolsCoreModule).createAsyncProviders(
          options,
        );
      });

      test('should call NestCommercetoolsCoreModule.createAsyncOptionsProvider', () => {
        expect(mockCreateAsyncOptionsProvider).toHaveBeenCalledWith(options);
      });

      test('should return expected response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('createAsyncOptionsProvider', () => {
    let options: any;
    let response;
    let expectedResponse;

    describe('when options includes useFactory', () => {
      describe('when options includes inject', () => {
        beforeAll(() => {
          options = { useFactory: true, inject: ['inject'] };
          expectedResponse = {
            provide: NEST_COMMERCETOOLS_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject,
          };
        });

        beforeEach(() => {
          response = (<any>(
            NestCommercetoolsCoreModule
          )).createAsyncOptionsProvider(options);
        });

        test('should return expected response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when options does not include inject', () => {
        beforeAll(() => {
          options = { useFactory: true };
          expectedResponse = {
            provide: NEST_COMMERCETOOLS_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: [],
          };
        });

        beforeEach(() => {
          response = (<any>(
            NestCommercetoolsCoreModule
          )).createAsyncOptionsProvider(options);
        });

        test('should return expected response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });
    });

    describe('when options does not includes useFactory', () => {
      describe('when options includes useClass', () => {
        beforeAll(() => {
          options = { useClass: 'useClass' };
          expectedResponse = {
            provide: NEST_COMMERCETOOLS_MODULE_OPTIONS,
            useFactory: async (optionsFactory) =>
              await optionsFactory.createNestCommercetoolsOptions(),
            inject: [options.useClass],
          };
        });

        beforeEach(() => {
          response = (<any>(
            NestCommercetoolsCoreModule
          )).createAsyncOptionsProvider(options);
        });

        test('should return expected response', () => {
          expect(JSON.stringify(response)).toEqual(
            JSON.stringify(expectedResponse),
          );
        });
      });

      describe('when options includes useExisting', () => {
        beforeAll(() => {
          options = { useExisting: 'useExisting' };
          expectedResponse = {
            provide: NEST_COMMERCETOOLS_MODULE_OPTIONS,
            useFactory: async (optionsFactory) =>
              await optionsFactory.createNestCommercetoolsOptions(),
            inject: [options.useExisting],
          };
        });

        beforeEach(() => {
          response = (<any>(
            NestCommercetoolsCoreModule
          )).createAsyncOptionsProvider(options);
        });

        test('should return expected response', () => {
          expect(JSON.stringify(response)).toEqual(
            JSON.stringify(expectedResponse),
          );
        });
      });
    });
  });
});
