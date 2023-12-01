import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import customObjectConfig from './config/communes.config';
import { CommunesService } from './communes.service';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomObjectsRepository]), ConfigModule.forFeature(customObjectConfig)],
  providers: [CommunesService],
  exports: [CommunesService],
  controllers: []
})
export class CommunesModule {}
