import { BadRequestException, Controller, Get, Headers } from '@nestjs/common';
import { BusinessUnitsCustomerService } from '@/business-units-customer/business-units-customer.service';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { CustomerBusinessUnits } from './models';
import { ICustomerBusinessUnits } from '@/business-units/business-units.interface';
import { EnumSwaggerTags } from '@/swagger/enum';

@Controller('customers')
@ApiTags(EnumSwaggerTags.BUSINESS_UNIT_CUSTOMER)
export class BusinessUnitsCustomerController {
  constructor(private readonly businessUnitsCustomerService: BusinessUnitsCustomerService, private readonly configService: ConfigService) {}

  private headerName = this.configService.get<string>('customerBusinessUnits.customerHeaderKey');

  @ApiOkResponse({
    description: 'List of Delivery Zones',
    type: CustomerBusinessUnits,
    isArray: false
  })
  @ApiHeader({
    name: 'x-user-id',
    description: 'Customer Email',
    required: true
  })
  @ApiOperation({ operationId: 'getBusinessUnitsForCustomer', deprecated: true, description: 'GET Business Units for user. (deprecated should use users/me/business-units)' })
  @Get('me/business-units')
  async getBusinessUnitsForCustomer(@Headers() headers: object): Promise<ICustomerBusinessUnits> {
    if (!headers[`${this.headerName}`]) {
      throw new BadRequestException('Customer ID missing');
    }
    return this.businessUnitsCustomerService.findBusinessUnitsForCustomer(headers[`${this.headerName}`]);
  }
}
