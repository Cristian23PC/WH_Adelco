import { ModuleMetadata, Type } from '@nestjs/common';

export interface SecretManagerModuleOptions {
  projectId: string;
}

export interface SecretManagerOptionsFactory {
  createSecretManagerOptions(): Promise<SecretManagerModuleOptions> | SecretManagerModuleOptions;
}

export interface SecretManagerModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<SecretManagerOptionsFactory>;
  useClass?: Type<SecretManagerOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<SecretManagerModuleOptions> | SecretManagerModuleOptions;
  inject?: any[];
}
