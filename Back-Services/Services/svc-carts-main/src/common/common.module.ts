import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '@/common/filters/exception.filter';
import { ValidatorService } from '@/common/validator/validator.service';

@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    },
    ValidatorService
  ],
  exports: [ValidatorService]
})
export class CommonModule {}
