import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KeycloakService } from './keycloak.service';
import keycloakConfig from './config/keycloak.config';
import { SecretManagerModule } from '@/secret-manager';
import { NotificationsModule } from '@/notifications';

@Module({
  imports: [
    SecretManagerModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        projectId: configService.get('commercetools.google.project')
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forFeature(keycloakConfig),
    NotificationsModule
  ],
  providers: [KeycloakService],
  exports: [KeycloakService]
})
export class KeycloakModule {}
