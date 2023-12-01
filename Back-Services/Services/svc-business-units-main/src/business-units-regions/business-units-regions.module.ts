import { NestCommercetoolsModule } from '@/nest-commercetools';
import { CacheModule, Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { CustomObjectsRepository, ChannelsRepository } from 'commercetools-sdk-repositories';
import customObjectConfigRegions from '@/regions/config/regions.config';
import customObjectConfigCommunes from '@/communes/config/communes.config';
import customObjectConfigDeliveryZones from '@/delivery-zones/config/delivery-zones.config';
import { RegionsService } from '@/regions/regions.service';
import { CommunesService } from '@/communes/communes.service';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { BusinessUnitsRegionsController } from './business-units-regions.controller';

@Module({
  imports: [
    NestCommercetoolsModule.forFeature([CustomObjectsRepository, ChannelsRepository]),
    ConfigModule.forFeature(customObjectConfigRegions),
    ConfigModule.forFeature(customObjectConfigCommunes),
    ConfigModule.forFeature(customObjectConfigDeliveryZones),
    CacheModule.register()
  ],
  providers: [RegionsService, CommunesService, DeliveryZonesService],
  controllers: [BusinessUnitsRegionsController]
})
export class BusinessUnitsRegionsModule {}
