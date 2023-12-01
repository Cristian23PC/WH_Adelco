import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Channel } from '@commercetools/platform-sdk';
import { Inject, Injectable } from '@nestjs/common';
import { DistributionCenterMap } from '../distribution-centers/interfaces';
import { ChannelsService } from '@/channels/channels.service';

const DISTRIBUTION_CENTER_KEY = 'distribution-centers-key';
const DEFAULT_TTL = 30 * 24 * 60 * 60; //A month

@Injectable()
export class DistributionCentersService {
  constructor(private channelsService: ChannelsService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getByKey(key: string): Promise<Channel> {
    const cachedDistributionCenterMap = (await this.cacheManager.get<DistributionCenterMap>(DISTRIBUTION_CENTER_KEY)) ?? {}[key];

    if (cachedDistributionCenterMap) {
      return cachedDistributionCenterMap[key];
    }

    const supplyChannels = await this.channelsService.getSupplyChannels();

    const distributionCentersMap = supplyChannels.reduce<DistributionCenterMap>((acc, x) => {
      const { key } = x;
      return acc[key] ? acc : { ...acc, [key]: x };
    }, {});

    await this.cacheManager.set(DISTRIBUTION_CENTER_KEY, distributionCentersMap, DEFAULT_TTL);

    return distributionCentersMap[key];
  }
}
