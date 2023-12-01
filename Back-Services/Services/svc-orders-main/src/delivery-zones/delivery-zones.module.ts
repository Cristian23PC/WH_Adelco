import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import customObjectConfig from './config/delivery-zones.config';
import { DeliveryZonesService } from './delivery-zones.service';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomObjectsRepository]), ConfigModule.forFeature(customObjectConfig)],
  providers: [DeliveryZonesService],
  exports: [DeliveryZonesService]
})
export class DeliveryZonesModule {}
