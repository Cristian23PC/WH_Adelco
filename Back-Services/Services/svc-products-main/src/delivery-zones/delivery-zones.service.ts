import { InjectRepository } from '@/nest-commercetools';
import { CustomObject } from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggerService } from '@/common/utils';
import loggerConfig from '@/config/logger.config';
import { ConfigCustomObject } from '@/delivery-zones/interfaces/delivery-zone.interface';

@Injectable()
export class DeliveryZonesService {
  private readonly loggerService = new LoggerService(loggerConfig());
  constructor(
    @InjectRepository(CustomObjectsRepository)
    private customObjectRepository: CustomObjectsRepository,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getT2Zone(key: string): Promise<CustomObject> {
    const cachedT2Zone = await this.cacheManager.get<CustomObject>(this.getCacheKey(key));
    if (cachedT2Zone) {
      this.loggerService.log('Cache hit: t2zone');
      return cachedT2Zone;
    }
    const { t2ZoneContainer, t2ZoneCacheTTL } = this.configService.get<ConfigCustomObject>('custom-object');
    const t2Zone = await this.customObjectRepository.getByContainerAndKey(t2ZoneContainer, key);
    this.loggerService.log('Cache missed: t2zone');
    await this.cacheManager.set(this.getCacheKey(key), t2Zone, t2ZoneCacheTTL);
    return t2Zone;
  }

  private getCacheKey(key: string): string {
    return `t2zone-${key}`;
  }
}
