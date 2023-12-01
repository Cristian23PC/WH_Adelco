import { AuthorizationAnonymousHeaders } from '@/common/decorator/headers.decorator';
import { BadRequestException, Body, Controller, Delete, Get, Headers, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBadRequestResponse, ApiHeader, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { AdelcoCart, convertToAdelcoFormat } from '@adelco/price-calc';
import { AdelcoCartsEntity } from './entity/adelco-carts.entity';
import { GetAnonymousCartRequestArgsDto, VerificationCartRequestArgsDto } from './dto/queryargs.dto';
import { UpdateLineItemQuantityRequestDto } from '@/business-unit-carts/dto/business-units-carts.dto';
import { LineItemDraftDto } from './dto/lineitem-draft.dto';
import { correlationIdHeader } from '@/common/constants/headers';
import { OrderContactRequestDto } from './dto/orderContactRequest';

@ApiTags('Carts')
@Controller('carts/anonymous-cart')
export class CartsController {
  constructor(private readonly cartsService: CartsService, private readonly configService: ConfigService) {}

  private anonymousHeaderId = this.configService.get<string>('cart.anonymousHeaderId');

  @ApiHeader({
    name: 'x-anonymous-id',
    required: true,
    description: 'ID provided by the client'
  })
  @ApiBadRequestResponse({
    description: '* Anonymous ID missing'
  })
  @ApiNotFoundResponse({ description: 'Active cart not found' })
  @HttpCode(200)
  @Post('/order-contact-request')
  async orderContactRequest(@Headers() headers: object, @Body() body: OrderContactRequestDto): Promise<void> {
    const anonymousId = headers[`${this.anonymousHeaderId}`];
    if (!anonymousId) {
      throw new BadRequestException('Anonymous ID missing');
    }
    return await this.cartsService.orderContactRequest(anonymousId, body);
  }

  @AuthorizationAnonymousHeaders()
  @ApiBadRequestResponse({
    description:
      '* Has different delivery zone set \
    \n * Anonymous ID missing'
  })
  @ApiNotFoundResponse({ description: 'Active cart not found' })
  @ApiOkResponse({ description: 'Active Cart', type: () => AdelcoCartsEntity })
  @Get()
  async getAnonymousCart(@Headers() headers: object, @Query() queries?: GetAnonymousCartRequestArgsDto): Promise<AdelcoCart> {
    if (!headers[`${this.anonymousHeaderId}`]) {
      throw new BadRequestException('Anonymous ID missing');
    }
    const cart = await this.cartsService.getAnonymousCart(queries.deliveryZone, headers[`${this.anonymousHeaderId}`]);

    const { cart: updatedCart, cartUpdates } = await this.cartsService.checkStockAndPriceChanges(cart, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @AuthorizationAnonymousHeaders()
  @ApiOkResponse({ description: 'Active Cart without the line item', type: () => AdelcoCartsEntity })
  @ApiBadRequestResponse({ description: 'Anonymous ID missing' })
  @ApiNotFoundResponse({
    description:
      '* Line Item not found \
     \n * Active cart not found'
  })
  @ApiParam({ name: 'lineItemId', type: 'string', required: true })
  @Delete('line-items/:lineItemId')
  async removeAnonymousLineItem(@Headers() headers: object, @Param('lineItemId') lineItemId: string, @Query() queries?: VerificationCartRequestArgsDto): Promise<AdelcoCart> {
    if (!headers[`${this.anonymousHeaderId}`]) {
      throw new BadRequestException('Anonymous ID missing');
    }
    const cart = await this.cartsService.removeAnonymousLineItem(lineItemId, headers[`${this.anonymousHeaderId}`]);

    const { cart: updatedCart, cartUpdates } = await this.cartsService.checkStockAndPriceChanges(cart, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @AuthorizationAnonymousHeaders()
  @ApiParam({ name: 'lineItemId', type: 'string', required: true })
  @ApiBadRequestResponse({
    description:
      '* Has different delivery zone set \
    \n * Anonymous ID missing \
    \n * Unable to determine product stock \
    \n * Delivery zone missing data \
    \n * Product is not on stock or there are not enough units'
  })
  @ApiNotFoundResponse({
    description:
      '* Active cart not found \
    \n * Line item not found \
    \n * Cart missing Delivery Zone'
  })
  @ApiOkResponse({ description: 'Active Cart', type: () => AdelcoCartsEntity })
  @Patch('line-items/:lineItemId/quantity')
  async updateAnonymousLineItemQuantity(
    @Headers() headers: object,
    @Param('lineItemId') id: string,
    @Body() body: UpdateLineItemQuantityRequestDto,
    @Query() queries?: VerificationCartRequestArgsDto
  ): Promise<AdelcoCart> {
    if (!headers[`${this.anonymousHeaderId}`]) {
      throw new BadRequestException('Anonymous ID missing');
    }
    const cart = await this.cartsService.updateAnonymousLineItemQuantity(id, body.quantity, headers[`${this.anonymousHeaderId}`]);

    const { cart: updatedCart, cartUpdates } = await this.cartsService.checkStockAndPriceChanges(cart, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @AuthorizationAnonymousHeaders()
  @ApiOkResponse({ description: 'Active Cart with the line items updated', type: () => AdelcoCartsEntity })
  @ApiNotFoundResponse({
    description:
      '* Product not found \
      \n * Delivery zone not found'
  })
  @ApiBadRequestResponse({
    description:
      '* Anonymous ID missing \
      \n * Delivery zone missmatch \
      \n * Delivery zone missing data \
      \n * Product availability not found in the supply channel \
      \n * Unable to determine product stock \
      \n * Product is not on stock or there are not enough units \
      \n * Supply channel not found \
      \n * Missing price for product \
      \n * Missing taxRate for product \
      \n * Invalid sku for product'
  })
  @Post('line-items')
  async addAnonymousLineItems(@Headers() headers: object, @Body() lineItemDraft: LineItemDraftDto, @Query() queries?: GetAnonymousCartRequestArgsDto): Promise<AdelcoCart> {
    if (!headers[`${this.anonymousHeaderId}`]) {
      throw new BadRequestException('Anonymous ID missing');
    }
    const cart = await this.cartsService.addAnonymousLineItems(lineItemDraft, queries.deliveryZone, headers[`${this.anonymousHeaderId}`]);
    const { cart: updatedCart, cartUpdates } = await this.cartsService.checkStockAndPriceChanges(cart, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @ApiNoContentResponse({ description: 'Empty body' })
  @HttpCode(204)
  @ApiHeader({
    name: correlationIdHeader,
    required: false,
    description: `ID to track the request`
  })
  @ApiNotFoundResponse({ description: ' * Business unit not found \n * Active cart not found' })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Delete()
  async deleteAnonymousCart(@Headers() headers: object): Promise<void> {
    if (!headers[`${this.anonymousHeaderId}`]) {
      throw new BadRequestException('Anonymous ID missing');
    }
    await this.cartsService.deleteAnonymousCart(headers[`${this.anonymousHeaderId}`]);
  }
}
