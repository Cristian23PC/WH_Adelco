import { Module } from '@nestjs/common';
import { CartsRepository } from 'commercetools-sdk-repositories';
import { NestCommercetoolsModule } from '@/nest-commercetools';
import { CartsService } from './carts.service';
import { ConfigModule } from '@nestjs/config';
import cartsConfig from './config/carts.config';
import { BusinessUnitsRepository } from '@/nest-commercetools/repositories/business-units';

@Module({
  imports: [NestCommercetoolsModule.forFeature([CartsRepository, BusinessUnitsRepository]), ConfigModule.forFeature(cartsConfig)],
  providers: [CartsService],
  exports: [CartsService]
})
export class CartsModule {}
