import { CacheInterceptor, CacheTTL, Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CommunesService } from './communes.service';
import { Commune } from './models';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

const CACHE_TTL = 86400000;
@CacheTTL(CACHE_TTL)
@UseInterceptors(CacheInterceptor)
@Controller('regions')
@ApiTags('Regions')
export class CommunesController {
  constructor(private communesService: CommunesService) {}

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
}
