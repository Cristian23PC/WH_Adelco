/* eslint-disable @typescript-eslint/no-unsafe-assignment*/
/* eslint-disable @typescript-eslint/no-unsafe-member-access*/
/* eslint-disable @typescript-eslint/no-unsafe-call */

import { NestCommercetoolsModule } from '@/nest-commercetools';
import { Module } from '@nestjs/common';
import { CartsRepository } from 'commercetools-sdk-repositories';
import { CartsService } from './carts.service';
import { ConfigModule } from '@nestjs/config';
import cartConfig from './config/cart.config';
import { CartsController } from './carts.controller';
import { DeliveryZonesModule } from '@/delivery-zones/delivery-zones.module';
import { ProductsModule } from '@/products/products.module';
import { CartsHelperModule } from '@/carts-helper/carts-helper.module';
import { ChannelsModule } from '@/channels/channels.module';
import { NotificationsModule } from '@/notifications';
import { BusinessUnitsModule } from '@/business-unit/business-units.module';
import { CustomersModule } from '@/customers/customers.module';

@Module({
  imports: [
    ChannelsModule,
    DeliveryZonesModule,
    ProductsModule,
    CartsHelperModule,
    BusinessUnitsModule,
    CustomersModule,
    NotificationsModule,
    NestCommercetoolsModule.forFeature([CartsRepository]),
    ConfigModule.forFeature(cartConfig)
  ],
  providers: [CartsService],
  exports: [CartsService],
  controllers: [CartsController]
})
export class CartsModule {}
