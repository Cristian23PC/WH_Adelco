import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { ProductProjectionsRepository } from 'commercetools-sdk-repositories';
import { ProductsService } from './products.service';
import { ConfigModule } from '@nestjs/config';
import productsConfig from './config/products.config';

@Module({
  imports: [NestCommercetoolsModule.forFeature([ProductProjectionsRepository]), ConfigModule.forFeature(productsConfig)],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
