import { AuthorizationHeaders } from '@/common/decorator/headers.decorator';
import { BadRequestException, Body, Controller, Headers, Param, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { BusinessUnitOrdersService } from './business-unit-orders.service';
import { ConvertActiveCartRequestDto, VerificationCartRequestArgsDto } from './dto/business-unit-orders.dto';
import { AdelcoOrdersEntity } from '@/orders/entity/adelco-orders.entity';
import { AdelcoOrder } from '@adelco/price-calc';

@AuthorizationHeaders()
@ApiTags('Business Unit Orders')
@Controller('business-unit')
export class BusinessUnitOrdersController {
  constructor(private readonly businessUnitOrdersService: BusinessUnitOrdersService, private readonly configService: ConfigService) {}

  private userHeaderId = this.configService.get<string>('business-unit-orders.userHeaderId');
  private userHeaderRoles = this.configService.get<string>('business-unit-orders.userHeaderRoles');

  @ApiOkResponse({ description: 'Order', status: 200, type: () => AdelcoOrdersEntity })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
      \n * User Roles missing \
      \n * Orders-026: Out of stock \
      \n * Orders-027: Price changed \
      \n * Orders-028: Discount code not applicable \
      \n * Orders-034: Invalid Stock or Price \
      \n * Orders-035: Invalid Minimum order amount'
  })
  @ApiNotFoundResponse({
    description:
      '* Cart not found \
      \n * Orders-020: Resource was not found'
  })
  @ApiParam({ name: 'businessUnitId', description: 'Business Unit ID', type: 'string', required: true })
  @Post(':businessUnitId/orders/convert-active-cart')
  async convertActiveCart(
    @Headers() headers: object,
    @Param('businessUnitId') businessUnitId: string,
    @Body() body: ConvertActiveCartRequestDto,
    @Query() queries?: VerificationCartRequestArgsDto
  ): Promise<AdelcoOrder> {
    if (!headers[this.userHeaderId]) {
      throw new BadRequestException('User ID missing');
    }
    if (!headers[this.userHeaderRoles]) {
      throw new BadRequestException('User Roles missing');
    }

    return this.businessUnitOrdersService.convertActiveCart(
      {
        businessUnitId,
        body,
        username: headers[this.userHeaderId],
        roles: JSON.parse(headers[this.userHeaderRoles])
      },
      queries?.forceUpdate
    );
  }
}
