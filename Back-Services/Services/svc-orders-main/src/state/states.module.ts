import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { StatesRepository } from 'commercetools-sdk-repositories';
import { StatesService } from './states.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import stateConfig from './config/state.config';

@Module({
  imports: [NestCommercetoolsModule.forFeature([StatesRepository]), CacheModule.register(), ConfigModule.forFeature(stateConfig)],
  providers: [StatesService],
  exports: [StatesService]
})
export class StatesModule {}
