import { AuthorizationHeaders } from '@/common/decorator/headers.decorator';
import { Body, Controller, Param, Patch, UseGuards, Headers } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from './orders.service';
import { UpdatePaymentDtoRequest } from './dto/update-payment.dto';
import { AdelcoOrder, convertToAdelcoFormat } from '@adelco/price-calc';
import { AdelcoOrdersEntity } from './entity/adelco-orders.entity';
import { UpdateDeliveriesDtoRequest } from './dto/update-deliveries.dto';
import { HeaderInternalGuard } from '@/guard/headers/headers-internal.guard';
import { CollectPaymentsDtoRequest } from './dto/collect-payments.dto';
import { CollectPaymentsResponse } from './orders.interface';

@UseGuards(HeaderInternalGuard)
@AuthorizationHeaders()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService, private readonly configService: ConfigService) {}

  private userHeaderId = this.configService.get<string>('orders.userHeaderId');

  @ApiOkResponse({ description: 'Adelco Order', status: 200, type: () => AdelcoOrdersEntity })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
      \n * User Roles missing \
      \n * Orders-035: Payment not associated to the order'
  })
  @ApiForbiddenResponse({
    description: '* Insufficient permissions'
  })
  @ApiParam({ name: 'orderId', description: 'Order ID', type: 'string', required: true })
  @Patch(':orderId/update-payment')
  async updatePayment(@Headers() { ['x-user-id']: username }, @Param('orderId') orderId: string, @Body() body: UpdatePaymentDtoRequest): Promise<AdelcoOrder> {
    return this.ordersService.updatePayment(orderId, body, username);
  }

  @ApiOkResponse({ description: 'Adelco Order', status: 200, type: () => AdelcoOrdersEntity })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
      \n * User Roles missing'
  })
  @ApiForbiddenResponse({
    description: '* Insufficient permissions'
  })
  @ApiParam({ name: 'orderId', description: 'Order ID', type: 'string', required: true })
  @Patch(':orderId/update-deliveries')
  async updateDeliveries(@Param('orderId') orderId: string, @Body() body: UpdateDeliveriesDtoRequest): Promise<AdelcoOrder> {
    return this.ordersService.updateDeliveries(orderId, body);
  }

  @ApiOkResponse({ description: 'Adelco Order', status: 200 })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
      \n * User Roles missing'
  })
  @ApiForbiddenResponse({
    description: '* Insufficient permissions'
  })
  @Patch('collect-payments')
  async collectPayments(@Headers() { ['x-user-id']: username }, @Body() body: CollectPaymentsDtoRequest): Promise<CollectPaymentsResponse<AdelcoOrder>> {
    const { orders, payments, creditNotes } = await this.ordersService.collectPayments(body, username);
    return { orders: orders.map(convertToAdelcoFormat), payments, creditNotes };
  }
}
