import { BusinessUnit, ConvertedBusinessUnit } from '@/business-units/models';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerBusinessUnits {
  constructor(businessUnits: ConvertedBusinessUnit[]) {
    this.businessUnits = businessUnits;
  }

  @ApiProperty({ type: BusinessUnit, isArray: true, description: 'Business Units Array' })
  businessUnits: ConvertedBusinessUnit[];
}

export interface ICustomerBusinessUnits {
  businessUnits: ConvertedBusinessUnit[];
}
