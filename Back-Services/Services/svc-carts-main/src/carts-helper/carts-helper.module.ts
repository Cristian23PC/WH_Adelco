import { Module } from '@nestjs/common';
import { CartsHelperService } from './carts-helper.service';
import { ProductsModule } from '@/products/products.module';
import { DeliveryZonesModule } from '@/delivery-zones/delivery-zones.module';
import { ChannelsModule } from '@/channels/channels.module';
import { ConfigModule } from '@nestjs/config';
import cartsHelperConfig from './config/carts-helper.config';

@Module({
  imports: [ProductsModule, DeliveryZonesModule, ChannelsModule, ConfigModule.forFeature(cartsHelperConfig)],
  providers: [CartsHelperService],
  exports: [CartsHelperService]
})
export class CartsHelperModule {}
