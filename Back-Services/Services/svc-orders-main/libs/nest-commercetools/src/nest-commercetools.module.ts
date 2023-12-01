import { DynamicModule, Module } from '@nestjs/common';
import {
  IRepository,
  NestCommercetoolsModuleAsyncOptions,
  NestCommercetoolsModuleOptions,
} from './interfaces/nest-commercetools-options.interface';
import { NestCommercetoolsCoreModule } from './nest-commercetools-core.module';
import { createNestCommercetoolsProviders } from './nest-commercetools.providers';

@Module({})
export class NestCommercetoolsModule {
  static forRoot(options: NestCommercetoolsModuleOptions): DynamicModule {
    return {
      module: NestCommercetoolsModule,
      imports: [NestCommercetoolsCoreModule.forRoot(options)],
    };
  }

  static forRootAsync(
    options: NestCommercetoolsModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: NestCommercetoolsModule,
      imports: [NestCommercetoolsCoreModule.forRootAsync(options)],
    };
  }

  static forFeature(repositories: IRepository[] = []): DynamicModule {
    const providers = createNestCommercetoolsProviders(repositories);
    return {
      module: NestCommercetoolsModule,
      providers: providers,
      exports: providers,
    };
  }
}
