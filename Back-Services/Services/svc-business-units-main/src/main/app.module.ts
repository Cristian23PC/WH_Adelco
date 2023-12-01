import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NestCommercetoolsModule } from '@/nest-commercetools';
import loggerConfig from '@/config/logger.config';
import { BusinessUnitsRegionsModule } from '@/business-units-regions/business-units-regions.module';
import { BusinessUnitsBestDeliveryZoneModule } from '@/business-units-best-delivery-zone/business-units-best-delivery-zone.module';
import { BusinessUnitsUsersModule } from '@/business-units-users/business-units-users.module';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import appConfig from '../config/app.config';
import { CommercetoolsConfigModule } from '@/commercetools-config/commercetools-config.module';
import { CommercetoolsConfigService } from '@/commercetools-config/commercetools-config.service';
import { AppController } from '@/main/app.controller';
import { AppService } from '@/main/app.service';
import { HttpLoggerMiddleware } from '@/common/middleware/http-logger.middleware';
import { BusinessUnitsModule } from '@/business-units/business-units.module';
import { PaymentsMethodsModule } from '@/payments-methods/payment-methods.module';
import { BusinessUnitsCustomerModule } from '@/business-units-customer/business-units-customer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig]
    }),
    CommonModule,
    NestCommercetoolsModule.forRootAsync({
      imports: [CommercetoolsConfigModule],
      useClass: CommercetoolsConfigService
    }),
    BusinessUnitsModule,
    BusinessUnitsRegionsModule,
    BusinessUnitsCustomerModule,
    PaymentsMethodsModule,
    BusinessUnitsBestDeliveryZoneModule,
    BusinessUnitsUsersModule,
    LoggerModule.forRoot(loggerConfig()),
    TerminusModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
