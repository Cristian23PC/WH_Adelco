import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChannelsRepository, CustomObjectsRepository } from 'commercetools-sdk-repositories';
import customObjectConfig from './config/delivery-zones.config';
import { DeliveryZonesService } from './delivery-zones.service';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomObjectsRepository, ChannelsRepository]), ConfigModule.forFeature(customObjectConfig), CommonModule],
  providers: [DeliveryZonesService],
  exports: [DeliveryZonesService],
  controllers: []
})
export class DeliveryZoneModule {}
