import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DistributionCentersService } from './distribution-centers.service';
import { ChannelsModule } from '@/channels/channels.module';

@Module({
  imports: [CacheModule.register(), ChannelsModule],
  providers: [DistributionCentersService],
  exports: [DistributionCentersService]
})
export class DistributionCentersModule {}
