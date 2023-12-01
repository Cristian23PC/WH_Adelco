import { Module } from '@nestjs/common';
import { BusinessUnitsUsersController } from './business-units-users.controller';
import { KeycloakModule } from '@/keycloak/keycloak.module';
import { BusinessUnitsModule } from '@/business-units/business-units.module';
import { RutModule } from '@/rut/rut.module';
import { BusinessUnitsUsersService } from './business-units-users.service';
import registrationConfig from './config/business-units-users.config';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from '@/customers/customers.module';
import { SequenceModule } from '@/sequence/sequence.module';

@Module({
  imports: [KeycloakModule, RutModule, BusinessUnitsModule, CustomersModule, SequenceModule, ConfigModule.forFeature(registrationConfig)],
  providers: [BusinessUnitsUsersService],
  controllers: [BusinessUnitsUsersController]
})
export class BusinessUnitsUsersModule {}
