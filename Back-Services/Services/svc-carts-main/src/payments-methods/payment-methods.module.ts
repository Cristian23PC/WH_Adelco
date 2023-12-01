import { Module } from '@nestjs/common';
import { PaymentsMethodsService } from './payment-methods.service';
import { NestCommercetoolsModule } from '@/nest-commercetools';
import { CustomObjectsRepository } from 'commercetools-sdk-repositories';
import { ConfigModule } from '@nestjs/config';
import customObjectConfig from './config/payment-methods.config';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CustomObjectsRepository]), ConfigModule.forFeature(customObjectConfig)],
  providers: [PaymentsMethodsService],
  exports: [PaymentsMethodsService]
})
export class PaymentsMethodsModule {}
