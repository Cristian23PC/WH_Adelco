import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import {
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  Middleware,
  QueueMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface IRepository {
  new (byProjectKeyRequestBuilder: ByProjectKeyRequestBuilder, ...args: any[]);
}

export interface NestCommercetoolsModuleOptions {
  auth?: AuthMiddlewareOptions;
  http: HttpMiddlewareOptions;
  logger?: boolean;
  middleware?: Middleware;
  queue?: QueueMiddlewareOptions;
  projectKey: string;
}

export interface NestCommercetoolsOptionsFactory {
  createNestCommercetoolsOptions():
    | Promise<NestCommercetoolsModuleOptions>
    | NestCommercetoolsModuleOptions;
}

export type NestCommercetoolsModuleFactoryOptions =
  NestCommercetoolsModuleOptions;

export interface NestCommercetoolsModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<NestCommercetoolsOptionsFactory>;
  useClass?: Type<NestCommercetoolsOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) =>
    | Promise<NestCommercetoolsModuleFactoryOptions>
    | NestCommercetoolsModuleFactoryOptions;
  inject?: any[];
}
