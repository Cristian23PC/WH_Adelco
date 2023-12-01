import { Injectable } from '@nestjs/common';
import { CustomersService } from '@/customers/customers.service';
import { BusinessUnitsService } from '@/business-units/business-units.service';
import { ICustomerBusinessUnits } from '../business-units/business-units.interface';

@Injectable()
export class BusinessUnitsCustomerService {
  constructor(private readonly customersService: CustomersService, private readonly businessUnitsService: BusinessUnitsService) {}

  async findBusinessUnitsForCustomer(email: string): Promise<ICustomerBusinessUnits> {
    const customer = await this.customersService.getCustomerByEmail(email);
    return await this.businessUnitsService.findBusinessUnits(customer.id);
  }
}
