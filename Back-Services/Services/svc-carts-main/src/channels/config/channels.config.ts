import { registerAs } from '@nestjs/config';

export default registerAs('channels', () => ({
  bySupplyChannelsCacheTTL: process.env.SUPPLY_CHANNELS_CACHE_TTL ?? 7200000, // 2 hours in milliseconds
  byDefaultChannelForDistributionCenterCacheTTL: process.env.DEFAULT_CHANNEL_DISTRIBUTION_CENTER_CACHE_TTL ?? 7200000 // 2 hours in milliseconds
}));
