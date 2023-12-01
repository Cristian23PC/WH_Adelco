import { Module } from '@nestjs/common';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { NestCommercetoolsModule } from '@/nest-commercetools';
import { SequenceService } from './sequence.service';
import { ConfigModule } from '@nestjs/config';
import sequenceConfig from './config/sequence.config';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomObjectsRepository]), ConfigModule.forFeature(sequenceConfig)],
  providers: [SequenceService],
  exports: [SequenceService]
})
export class SequenceModule {}
