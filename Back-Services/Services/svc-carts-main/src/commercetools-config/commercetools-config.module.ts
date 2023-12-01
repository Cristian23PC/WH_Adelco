import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SecretManagerModule } from '../secret-manager';

import commercetoolsConfig from '../config/commercetools.config';

import { CommercetoolsConfigService } from './commercetools-config.service';

@Module({
  imports: [
    ConfigModule.forFeature(commercetoolsConfig),
    SecretManagerModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        projectId: configService.get('commercetools.google.project')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [CommercetoolsConfigService],
  exports: [CommercetoolsConfigService]
})
export class CommercetoolsConfigModule {}
