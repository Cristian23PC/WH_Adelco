const GCP_SCRT_MANAGER_MODULE_OPTIONS = 'GCP_SCRT_MANAGER_MODULE_OPTIONS';
jest.mock('./secret-manager.constants', () => ({
  GCP_SCRT_MANAGER_MODULE_OPTIONS
}));

import { SecretManagerModule } from './secret-manager.module';

describe('SecretManagerModule', () => {
  describe('register', () => {
    let options;
    let response;
    let expectedResponse;

    beforeAll(() => {
      options = { proejctId: 'projectId' };
      expectedResponse = {
        module: SecretManagerModule,
        providers: [{ provide: GCP_SCRT_MANAGER_MODULE_OPTIONS, useValue: options }]
      };
    });

    beforeEach(() => {
      response = SecretManagerModule.register(options);
    });

    test('should return a DynamicModule with SecretManagerModule module and SecretManagerModuleOptions as provider', () => {
      expect(response).toEqual(expectedResponse);
    });
  });

  describe('registerAsync', () => {
    let options;

    let mockCreateAsyncProviders;

    let response;
    let expectedResponse;

    describe('when options includes imports', () => {
      beforeAll(() => {
        options = { imports: ['imports'] };
        expectedResponse = {
          module: SecretManagerModule,
          imports: options.imports,
          providers: [{ provide: 'asyncProvide' }]
        };
      });

      beforeEach(() => {
        mockCreateAsyncProviders = jest.spyOn(SecretManagerModule as any, 'createAsyncProviders').mockReturnValueOnce([{ provide: 'asyncProvide' }]);
        response = SecretManagerModule.registerAsync(options);
      });

      test('should call SecretManagerModule.createAsyncProviders with options', () => {
        expect(mockCreateAsyncProviders).toHaveBeenCalledWith(options);
      });

      test('should return expected response', () => {
        expect(JSON.stringify(response)).toEqual(JSON.stringify(expectedResponse));
      });
    });

    describe('when options does not include imports', () => {
      beforeAll(() => {
        options = {};
        expectedResponse = {
          module: SecretManagerModule,
          imports: [],
          providers: [{ provide: 'asyncProvide' }]
        };
      });

      beforeEach(() => {
        mockCreateAsyncProviders = jest.spyOn(SecretManagerModule as any, 'createAsyncProviders').mockReturnValueOnce([{ provide: 'asyncProvide' }]);
        response = SecretManagerModule.registerAsync(options);
      });

      test('should call SecretManagerModule.createAsyncProviders with options', () => {
        expect(mockCreateAsyncProviders).toHaveBeenCalledWith(options);
      });

      test('should return expected response', () => {
        expect(JSON.stringify(response)).toEqual(JSON.stringify(expectedResponse));
      });
    });
  });

  describe('createAsyncProviders', () => {
    let options: any;

    let mockCreateAsyncOptionsProvider;

    let response;
    let expectedResponse;

    beforeEach(() => {
      mockCreateAsyncOptionsProvider = jest.spyOn(SecretManagerModule as any, 'createAsyncOptionsProvider').mockReturnValueOnce({ provide: 'asyncProvide' });
    });

    describe('when options includes useExisting', () => {
      beforeAll(() => {
        options = { useExisting: true };
        expectedResponse = [{ provide: 'asyncProvide' }];
      });

      beforeEach(() => {
        response = (<any>SecretManagerModule).createAsyncProviders(options);
      });

      test('should call SecretManagerModule.createAsyncOptionsProvider', () => {
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
        response = (<any>SecretManagerModule).createAsyncProviders(options);
      });

      test('should call SecretManagerModule.createAsyncOptionsProvider', () => {
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
            useClass: options.useClass
          }
        ];
      });

      beforeEach(() => {
        response = (<any>SecretManagerModule).createAsyncProviders(options);
      });

      test('should call SecretManagerModule.createAsyncOptionsProvider', () => {
        expect(mockCreateAsyncOptionsProvider).toHaveBeenCalledWith(options);
      });

      test('should return expected response', () => {
        expect(response).toEqual(expectedResponse);
      });
    });
  });

  describe('createAsyncOptionsProvider', () => {
    let options;
    let response;
    let expectedResponse;

    describe('when options includes useFactory', () => {
      describe('when options includes inject', () => {
        beforeAll(() => {
          options = { useFactory: true, inject: ['inject'] };
          expectedResponse = {
            provide: GCP_SCRT_MANAGER_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: options.inject
          };
        });

        beforeEach(() => {
          response = (<any>SecretManagerModule).createAsyncOptionsProvider(options);
        });

        test('should return expected response', () => {
          expect(response).toEqual(expectedResponse);
        });
      });

      describe('when options does not include inject', () => {
        beforeAll(() => {
          options = { useFactory: true };
          expectedResponse = {
            provide: GCP_SCRT_MANAGER_MODULE_OPTIONS,
            useFactory: options.useFactory,
            inject: []
          };
        });

        beforeEach(() => {
          response = (<any>SecretManagerModule).createAsyncOptionsProvider(options);
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
            provide: GCP_SCRT_MANAGER_MODULE_OPTIONS,
            useFactory: async optionsFactory => await optionsFactory.createSecretManagerOptions(),
            inject: [options.useClass]
          };
        });

        beforeEach(() => {
          response = (<any>SecretManagerModule).createAsyncOptionsProvider(options);
        });

        test('should return expected response', () => {
          expect(JSON.stringify(response)).toEqual(JSON.stringify(expectedResponse));
        });
      });

      describe('when options includes useExisting', () => {
        beforeAll(() => {
          options = { useExisting: 'useExisting' };
          expectedResponse = {
            provide: GCP_SCRT_MANAGER_MODULE_OPTIONS,
            useFactory: async optionsFactory => await optionsFactory.createSecretManagerOptions(),
            inject: [options.useExisting]
          };
        });

        beforeEach(() => {
          response = (<any>SecretManagerModule).createAsyncOptionsProvider(options);
        });

        test('should return expected response', () => {
          expect(JSON.stringify(response)).toEqual(JSON.stringify(expectedResponse));
        });
      });
    });
  });
});
