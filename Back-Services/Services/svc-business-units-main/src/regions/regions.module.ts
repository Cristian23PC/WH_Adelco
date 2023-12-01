import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import customObjectConfig from './config/regions.config';
import { RegionsService } from './regions.service';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomObjectsRepository]), ConfigModule.forFeature(customObjectConfig)],
  providers: [RegionsService],
  exports: [RegionsService],
  controllers: []
})
export class RegionsModule {}
