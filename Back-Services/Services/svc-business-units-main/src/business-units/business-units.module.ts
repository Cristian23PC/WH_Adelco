import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';
import { BusinessUnitsService } from './business-units.service';
import { ChannelsRepository } from 'commercetools-sdk-repositories';
import { BusinessUnitsController } from './business-units.controller';
import { DeliveryZoneModule } from '@/delivery-zones/delivery-zones.module';
import { ConfigModule } from '@nestjs/config';
import businessUnitsConfig from './config/business-units.config';
import { PaymentsMethodsModule } from '@/payments-methods/payment-methods.module';
import { SequenceModule } from '@/sequence/sequence.module';
import { CustomersModule } from '@/customers/customers.module';

@Module({
  imports: [
    PaymentsMethodsModule,
    DeliveryZoneModule,
    SequenceModule,
    CustomersModule,
    NestCommercetoolsModule.forFeature([BusinessUnitsRepository, ChannelsRepository]),
    ConfigModule.forFeature(businessUnitsConfig)
  ],
  providers: [BusinessUnitsService],
  controllers: [BusinessUnitsController],
  exports: [BusinessUnitsService]
})
export class BusinessUnitsModule {}
