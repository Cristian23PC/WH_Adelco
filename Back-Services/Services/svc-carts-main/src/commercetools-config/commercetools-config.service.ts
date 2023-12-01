import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestCommercetoolsModuleOptions, NestCommercetoolsOptionsFactory } from '@/nest-commercetools';
import { SecretManagerService } from '../secret-manager';

@Injectable()
export class CommercetoolsConfigService implements NestCommercetoolsOptionsFactory {
  private readonly commercetoolsConfig: any;

  constructor(private configService: ConfigService, private secretManagerService: SecretManagerService) {
    this.commercetoolsConfig = this.configService.get<any>('commercetools');
  }

  async createNestCommercetoolsOptions(): Promise<NestCommercetoolsModuleOptions> {
    const { google: googleConfig, ...config } = this.commercetoolsConfig;

    const { CT_CLIENT_ID: clientId, CT_CLIENT_SECRET: clientSecret }: { CT_CLIENT_ID: string; CT_CLIENT_SECRET: string } = await this.secretManagerService.get(
      googleConfig.ctCredentialsSecretKey
    );

    return {
      ...config,
      auth: {
        ...config.auth,
        credentials: { clientId, clientSecret }
      }
    };
  }
}
