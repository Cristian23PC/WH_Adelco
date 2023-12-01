import { Controller, Get, Param, CacheInterceptor, UseInterceptors, CacheTTL } from '@nestjs/common';
import { RegionsService } from '@/regions/regions.service';
import { CommunesService } from '@/communes/communes.service';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { Region } from '@/regions/models';
import { Commune } from '@/communes/models';
import { DeliveryZone } from '@/delivery-zones/models';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { EnumSwaggerTags } from '@/swagger/enum';

const CACHE_TTL = 86400000;
@CacheTTL(CACHE_TTL)
@UseInterceptors(CacheInterceptor)
@Controller('regions')
@ApiTags(EnumSwaggerTags.REGIONS_COMMUNES_DELIVERY_ZONES)
export class BusinessUnitsRegionsController {
  constructor(private readonly regionsService: RegionsService, private readonly communesService: CommunesService, private readonly deliveryZonesService: DeliveryZonesService) {}

  @ApiOkResponse({
    description: 'List of regions',
    type: Region,
    isArray: true
  })
  @ApiOperation({ operationId: 'getRegions', description: 'GET regions' })
  @Get()
  async getRegions(): Promise<Region[]> {
    return await this.regionsService.getRegions();
  }

  @ApiOkResponse({
    description: 'List of Communes',
    type: Commune,
    isArray: true
  })
  @ApiOperation({ operationId: 'getCommunes', description: 'GET communes by region key' })
  @Get(':regionKey/communes')
  async getCommunes(@Param('regionKey') regionKey: string): Promise<Commune[]> {
    return await this.communesService.getCommunes(regionKey);
  }

  @ApiOkResponse({
    description: 'List of Delivery Zones',
    type: DeliveryZone,
    isArray: true
  })
  @ApiOperation({ operationId: 'getDeliveryZones', description: 'GET delivery zones by region key and commune key' })
  @Get(':regionKey/communes/:communeKey/delivery-zones')
  async getDeliveryZones(@Param('regionKey') regionKey: string, @Param('communeKey') communeKey: string): Promise<DeliveryZone[]> {
    const commune = await this.communesService.getCommune(communeKey);

    if (!commune || commune.region !== regionKey) {
      return [];
    }

    return await this.deliveryZonesService.getDeliveryZones(communeKey);
  }
}
