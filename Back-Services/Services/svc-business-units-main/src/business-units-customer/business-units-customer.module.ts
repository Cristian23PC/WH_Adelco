import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import customerBusinessUnitsConfig from '@/business-units-customer/config/business-units-customer.config';
import { CustomersModule } from '@/customers/customers.module';
import { BusinessUnitsModule } from '@/business-units/business-units.module';
import { BusinessUnitsCustomerService } from './business-units-customer.service';
import { BusinessUnitsCustomerController } from './business-units-customer.controller';

@Module({
  imports: [CustomersModule, BusinessUnitsModule, ConfigModule.forFeature(customerBusinessUnitsConfig)],
  providers: [BusinessUnitsCustomerService],
  exports: [BusinessUnitsCustomerService],
  controllers: [BusinessUnitsCustomerController]
})
export class BusinessUnitsCustomerModule {}
