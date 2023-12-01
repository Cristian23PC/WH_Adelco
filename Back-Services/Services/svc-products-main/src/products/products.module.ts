import { Module } from '@nestjs/common';
import { ProductProjectionsRepository } from 'commercetools-sdk-repositories';
import { ProductsService } from './products.service';
import { ConfigModule } from '@nestjs/config';
import productsConfig from './config/products.config';
import { DistributionCentersModule } from '@/distribution-centers/distribution-centers.module';
import { NestCommercetoolsModule } from '@/nest-commercetools';

@Module({
  imports: [NestCommercetoolsModule.forFeature([ProductProjectionsRepository]), ConfigModule.forFeature(productsConfig), DistributionCentersModule],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
