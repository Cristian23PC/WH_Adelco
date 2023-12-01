import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import {
  NestCommercetoolsModuleAsyncOptions,
  NestCommercetoolsModuleFactoryOptions,
  NestCommercetoolsModuleOptions,
  NestCommercetoolsOptionsFactory,
} from './interfaces';
import getByProjectKeyRequestBuilder from './get-by-project-key-request-builder';
import {
  NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
  NEST_COMMERCETOOLS_MODULE_OPTIONS,
} from './nest-commercetools.constants';

@Global()
@Module({})
export class NestCommercetoolsCoreModule {
  static forRoot(options: NestCommercetoolsModuleOptions): DynamicModule {
    const byProjectKeyRequestBuilderProvider = {
      provide: NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
      useValue: getByProjectKeyRequestBuilder(options),
    };
    return {
      module: NestCommercetoolsCoreModule,
      providers: [byProjectKeyRequestBuilderProvider],
      exports: [byProjectKeyRequestBuilderProvider],
    };
  }

  static forRootAsync(
    options: NestCommercetoolsModuleAsyncOptions,
  ): DynamicModule {
    const byProjectKeyRequestBuilderProvider = {
      provide: NEST_COMMERCETOOLS_BY_PROJECT_KEY_REQUEST_BUILDER,
      useFactory: async (
        opts: NestCommercetoolsModuleFactoryOptions,
      ): Promise<any> => getByProjectKeyRequestBuilder(opts),
      inject: [NEST_COMMERCETOOLS_MODULE_OPTIONS],
    };
    const asyncProviders =
      NestCommercetoolsCoreModule.createAsyncProviders(options);
    return {
      module: NestCommercetoolsCoreModule,
      imports: options.imports || [],
      providers: [...asyncProviders, byProjectKeyRequestBuilderProvider],
      exports: [byProjectKeyRequestBuilderProvider],
    };
  }

  private static createAsyncProviders(
    options: NestCommercetoolsModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [NestCommercetoolsCoreModule.createAsyncOptionsProvider(options)];
    }
    return [
      NestCommercetoolsCoreModule.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: NestCommercetoolsModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: NEST_COMMERCETOOLS_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: NEST_COMMERCETOOLS_MODULE_OPTIONS,
      useFactory: async (optionsFactory: NestCommercetoolsOptionsFactory) =>
        await optionsFactory.createNestCommercetoolsOptions(),
      inject: [options.useClass || options.useExisting],
    };
  }
  
}
