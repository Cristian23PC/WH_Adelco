import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { BusinessUnitsHelper } from '@/common/helpers/business-units/business-units.helper';
import { ConfigModule } from '@nestjs/config';
import commonObjectConfig from './config/common.config';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    BusinessUnitsHelper
  ],
  exports: [BusinessUnitsHelper],
  imports: [ConfigModule.forFeature(commonObjectConfig)]
})
export class CommonModule {}
