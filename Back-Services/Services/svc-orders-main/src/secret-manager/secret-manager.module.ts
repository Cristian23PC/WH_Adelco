import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { SecretManagerOptionsFactory, SecretManagerModuleAsyncOptions, SecretManagerModuleOptions } from './interfaces/secret-manager-options.interface';
import { SecretManagerService } from './secret-manager.service';
import { GCP_SCRT_MANAGER_MODULE_OPTIONS } from './secret-manager.constants';

@Global()
@Module({
  providers: [SecretManagerService],
  exports: [SecretManagerService]
})
export class SecretManagerModule {
  static register(options: SecretManagerModuleOptions): DynamicModule {
    return {
      module: SecretManagerModule,
      providers: [{ provide: GCP_SCRT_MANAGER_MODULE_OPTIONS, useValue: options }]
    };
  }

  static registerAsync(options: SecretManagerModuleAsyncOptions): DynamicModule {
    return {
      module: SecretManagerModule,
      imports: options.imports || [],
      providers: [...SecretManagerModule.createAsyncProviders(options)]
    };
  }

  private static createAsyncProviders(options: SecretManagerModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [SecretManagerModule.createAsyncOptionsProvider(options)];
    }
    return [
      SecretManagerModule.createAsyncOptionsProvider(options),
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ];
  }

  private static createAsyncOptionsProvider(options: SecretManagerModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: GCP_SCRT_MANAGER_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }
    return {
      provide: GCP_SCRT_MANAGER_MODULE_OPTIONS,
      useFactory: async (optionsFactory: SecretManagerOptionsFactory) => await optionsFactory.createSecretManagerOptions(),
      inject: [options.useExisting || options.useClass]
    };
  }
}
