import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import businessUnitOrdersConfig from './config/business-unit-orders.config';
import { BusinessUnitOrdersController } from './business-unit-orders.controller';
import { BusinessUnitOrdersService } from './business-unit-orders.service';
import { SvcCartsModule } from '@/svc-carts/svc-carts.module';
import { OrdersHelperModule } from '@/orders-helper/orders-helper.module';
import { OrdersModule } from '@/orders/orders.module';
import { PaymentsModule } from '@/payments/payments.module';
import { PaymentsHelperModule } from '@/payments-helper/payments-helper.module';
import { CartsModule } from '@/carts/carts.module';
import { SvcBusinessUnitsModule } from '@/svc-business-units/svc-business-units.module';
import { PaymentsMethodsModule } from '@/payments-methods/payment-methods.module';

@Module({
  imports: [
    PaymentsModule,
    PaymentsHelperModule,
    OrdersModule,
    OrdersHelperModule,
    SvcCartsModule,
    SvcBusinessUnitsModule,
    CartsModule,
    PaymentsMethodsModule,
    ConfigModule.forFeature(businessUnitOrdersConfig)
  ],
  providers: [BusinessUnitOrdersService],
  controllers: [BusinessUnitOrdersController]
})
export class BusinessUnitOrdersModule {}
