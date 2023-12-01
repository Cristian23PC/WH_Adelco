import { ApiProperty } from '@nestjs/swagger';
import { BusinessUnit, ConvertedBusinessUnit } from '@/business-units/models';

export class BusinessUnitsUsers {
  constructor() {}

  @ApiProperty({ description: 'Status code' })
  status?: number;

  @ApiProperty({ description: 'Success message' })
  message?: string;
}

export class UserBusinessUnits {
  constructor(businessUnits: ConvertedBusinessUnit[]) {
    this.businessUnits = businessUnits;
  }

  @ApiProperty({ type: BusinessUnit, isArray: true, description: 'Business Units Array' })
  businessUnits: ConvertedBusinessUnit[];
}

export interface IUserBusinessUnits {
  businessUnits: ConvertedBusinessUnit[];
}
