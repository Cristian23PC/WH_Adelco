import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRepository } from '@/nest-commercetools';
import { ChannelsRepository } from 'commercetools-sdk-repositories';
import { Channel } from '@commercetools/platform-sdk';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoggerService } from '@/common/utils';
import loggerConfig from '@/config/logger.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChannelsService {
  private readonly loggerService = new LoggerService(loggerConfig());
  constructor(
    @InjectRepository(ChannelsRepository)
    private channelsRepository: ChannelsRepository,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getChannel(id: string): Promise<Channel> {
    const cachedChannel = await this.cacheManager.get<Channel>(this.getCacheKey(id));
    if (cachedChannel) {
      this.loggerService.log('Cache hit: Channel');
      return cachedChannel;
    }
    const channel = await this.channelsRepository.getById(id);
    this.loggerService.log('Cache missed: Channel');
    await this.cacheManager.set(this.getCacheKey(id), channel, this.configService.get<number>('channels.cacheTTL'));
    return channel;
  }

  async getSupplyChannels(): Promise<Channel[]> {
    const supplyChannels = await this.channelsRepository.find({ queryArgs: { where: ['roles contains all ("InventorySupply")'] } });

    return supplyChannels.results;
  }

  private getCacheKey(id: string): string {
    return `channel-${id}`;
  }
}
