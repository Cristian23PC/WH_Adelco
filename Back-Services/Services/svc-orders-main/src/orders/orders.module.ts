import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CustomObjectsRepository, OrdersRepository } from 'commercetools-sdk-repositories';
import { NestCommercetoolsModule } from '@/nest-commercetools';
import { PaymentsModule } from '@/payments/payments.module';
import { OrdersController } from './orders.controller';
import { ConfigModule } from '@nestjs/config';
import ordersConfig from './config/orders.config';
import { NotificationsModule } from '@/notifications';
import { OrdersHelperModule } from '@/orders-helper/orders-helper.module';
import { CreditNotesService } from '@/credit-notes/credit-notes.service';

@Module({
  imports: [
    PaymentsModule,
    NotificationsModule,
    OrdersHelperModule,
    NestCommercetoolsModule.forFeature([OrdersRepository, CustomObjectsRepository]),
    ConfigModule.forFeature(ordersConfig)
  ],
  providers: [OrdersService, CreditNotesService],
  exports: [OrdersService],
  controllers: [OrdersController]
})
export class OrdersModule {}
