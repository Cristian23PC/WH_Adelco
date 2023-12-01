import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChannelsRepository } from 'commercetools-sdk-repositories';
import { ChannelsService } from './channels.service';
import channelsConfig from './config/channels.config';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [NestCommercetoolsModule.forFeature([ChannelsRepository]), ConfigModule.forFeature(channelsConfig), CacheModule.register()],
  providers: [ChannelsService],
  exports: [ChannelsService]
})
export class ChannelsModule {}
