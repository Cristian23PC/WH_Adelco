import { Module } from '@nestjs/common';
import { BusinessUnitCartsController } from './business-unit-carts.controller';
import { ConfigModule } from '@nestjs/config';
import businessUnitsCartsConfig from './config/business-units-carts.config';
import { CartsModule } from '@/carts/carts.module';
import { BusinessUnitCartsService } from './business-unit-carts.service';
import { BusinessUnitsModule } from '@/business-unit/business-units.module';
import { ProductsModule } from '@/products/products.module';
import { DeliveryZonesModule } from '@/delivery-zones/delivery-zones.module';
import { CartsHelperModule } from '@/carts-helper/carts-helper.module';
import { ChannelsModule } from '@/channels/channels.module';
import { CommonModule } from '@/common/common.module';
import { PaymentsMethodsModule } from '@/payments-methods/payment-methods.module';

@Module({
  imports: [
    ChannelsModule,
    CartsModule,
    BusinessUnitsModule,
    ProductsModule,
    DeliveryZonesModule,
    CartsHelperModule,
    PaymentsMethodsModule,
    ConfigModule.forFeature(businessUnitsCartsConfig),
    CommonModule
  ],
  providers: [BusinessUnitCartsService],
  controllers: [BusinessUnitCartsController],
  exports: [BusinessUnitCartsService]
})
export class BusinessUnitCartsModule {}
