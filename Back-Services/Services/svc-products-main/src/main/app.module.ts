import { MiddlewareConsumer, Module } from '@nestjs/common';
import { NestCommercetoolsModule } from '@/nest-commercetools';
import loggerConfig from '@/config/logger.config';
import { CommonModule } from '@/common/common.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '@/main/app.controller';
import { AppService } from '@/main/app.service';
import { HttpLoggerMiddleware } from '@/common/middleware/http-logger.middleware';
import { LoggerModule } from 'nestjs-pino';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import appConfig from '../config/app.config';
import { CommercetoolsConfigModule } from '@/commercetools-config/commercetools-config.module';
import { CommercetoolsConfigService } from '@/commercetools-config/commercetools-config.service';
import { CategoriesModule } from '@/categories/categories.module';
import { CatalogProductsModule } from '@/catalog-products/catalog-products.module';

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
    LoggerModule.forRoot(loggerConfig()),
    TerminusModule,
    HttpModule,
    CatalogProductsModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
