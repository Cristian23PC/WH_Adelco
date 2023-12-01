import { NestCommercetoolsModule } from '@/nest-commercetools';
import { CacheModule, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { ChannelsRepository, CustomObjectsRepository } from 'commercetools-sdk-repositories';
import customObjectConfigDeliveryZones from '@/delivery-zones/config/delivery-zones.config';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { BusinessUnitsBestDeliveryZoneController } from './business-units-best-delivery-zone.controller';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomObjectsRepository, ChannelsRepository]), ConfigModule.forFeature(customObjectConfigDeliveryZones), CacheModule.register()],
  providers: [DeliveryZonesService],
  controllers: [BusinessUnitsBestDeliveryZoneController]
})
export class BusinessUnitsBestDeliveryZoneModule {}
