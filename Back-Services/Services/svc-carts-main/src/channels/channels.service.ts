import { InjectRepository } from '@/nest-commercetools/decorators/nest-commercetools.decorators';
import { Channel } from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { ChannelsRepository } from 'commercetools-sdk-repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';

const SUPPLY_CHANNELS_CACHE_KEY = 'supplyChannels';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelsRepository)
    private channelsRepository: ChannelsRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService
  ) {}

  async getSupplyChannels(): Promise<Channel[]> {
    let supplyChannels = await this.cacheManager.get<Channel[]>(SUPPLY_CHANNELS_CACHE_KEY);
    if (!supplyChannels) {
      const { results } = await this.channelsRepository.find({ queryArgs: { where: ['roles contains all ("InventorySupply")'] } });
      supplyChannels = results;
      await this.cacheManager.set(SUPPLY_CHANNELS_CACHE_KEY, supplyChannels, this.configService.get<number>('channels.bySupplyChannelsCacheTTL'));
    }
    return supplyChannels;
  }

  async getDefaultChannelForDistributionCenter(dcCode: string): Promise<Channel> {
    let channel = await this.cacheManager.get<Channel>(dcCode);
    if (!channel) {
      const { results } = await this.channelsRepository.find({
        queryArgs: {
          where: [
            'roles contains any ("ProductDistribution")',
            `custom(fields(distributionCenterCode="${dcCode}"))`,
            'custom(fields(customerGroup="01"))' //'Tradicional' Channel
          ],
          limit: 1
        }
      });
      channel = results[0];
      await this.cacheManager.set(dcCode, channel, this.configService.get<number>('channels.byDefaultChannelForDistributionCenterCacheTTL'));
    }
    return channel;
  }
}
