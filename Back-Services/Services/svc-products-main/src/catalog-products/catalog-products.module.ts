import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CatalogProductsService } from './catalog-products.service';
import { CatalogProductsController } from './catalog-products.controller';
import { ChannelsModule } from '@/channels/channels.module';
import { DeliveryZonesModule } from '@/delivery-zones/delivery-zones.module';
import { ProductsModule } from '@/products/products.module';
import { CategoriesModule } from '@/categories/categories.module';

@Module({
  imports: [ProductsModule, ChannelsModule, DeliveryZonesModule, CategoriesModule, CacheModule.register()],
  providers: [CatalogProductsService],
  exports: [],
  controllers: [CatalogProductsController]
})
export class CatalogProductsModule {}
