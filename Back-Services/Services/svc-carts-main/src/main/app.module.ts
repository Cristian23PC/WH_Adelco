import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NestCommercetoolsModule } from '@/nest-commercetools';
import loggerConfig from '@/config/logger.config';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/main/app.controller';
import { AppService } from '@/main/app.service';
import { HttpLoggerMiddleware } from '@/common/middleware/http-logger.middleware';
import { LoggerModule, PinoLogger } from 'nestjs-pino';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import appConfig from '../config/app.config';
import { CommercetoolsConfigModule } from '@/commercetools-config/commercetools-config.module';
import { CommercetoolsConfigService } from '@/commercetools-config/commercetools-config.service';
import { BusinessUnitCartsModule } from '@/business-unit-carts/business-unit-carts.module';
import { CartsModule } from '@/carts/carts.module';
import { HeaderPropagationMiddleware } from '@/common/middleware/headerPropagation.middleware';
import { LoggerService } from '@/common/utils';
import { PaymentsMethodsModule } from '@/payments-methods/payment-methods.module';

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
    BusinessUnitCartsModule,
    CartsModule,
    PaymentsMethodsModule,
    LoggerModule.forRoot(loggerConfig()),
    TerminusModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: PinoLogger,
      useClass: LoggerService
    }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeaderPropagationMiddleware, HttpLoggerMiddleware).forRoutes('*');
  }
}
