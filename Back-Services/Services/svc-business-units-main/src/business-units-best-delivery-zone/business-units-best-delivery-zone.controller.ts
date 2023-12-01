import { Controller, Get, CacheInterceptor, UseInterceptors, CacheTTL, Query } from '@nestjs/common';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { DeliveryZone } from '@/delivery-zones/models';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetDeliveryZoneByLocalityDto } from './dto/business-units-best-delivery-zone.dto';
import { EnumSwaggerTags } from '@/swagger/enum';

const CACHE_TTL = 86400000;
@CacheTTL(CACHE_TTL)
@UseInterceptors(CacheInterceptor)
@Controller('delivery-zones')
@ApiTags(EnumSwaggerTags.BEST_DELIVERY_ZONE)
export class BusinessUnitsBestDeliveryZoneController {
  constructor(private readonly deliveryZonesService: DeliveryZonesService) {}

  @ApiOkResponse({
    description: 'List of best Delivery Zones for locality',
    type: DeliveryZone,
    isArray: true
  })
  @ApiNotFoundResponse({
    description: 'Not Found'
  })
  @ApiOperation({ operationId: 'getDeliveryZonesByLocality', description: 'GET Delivery Zones' })
  @Get()
  async getDeliveryZonesByLocality(@Query() query: GetDeliveryZoneByLocalityDto): Promise<DeliveryZone[]> {
    return await this.deliveryZonesService.getDeliveryZonesByLocality(query.locality);
  }
}
