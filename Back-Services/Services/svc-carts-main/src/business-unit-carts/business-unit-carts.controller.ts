import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Headers, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { BusinessUnitCartsService } from './business-unit-carts.service';
import { ConfigService } from '@nestjs/config';
import { UpdateLineItemQuantityRequestDto, UpdateSyncCartRequestDto } from './dto/business-units-carts.dto';
import { AuthorizationParams } from '@/common/decorator/business-unit-carts/params.decorator';
import { AdelcoCart, convertToAdelcoFormat } from '@adelco/price-calc';
import { AdelcoCartsEntity } from '@/carts/entity/adelco-carts.entity';
import { LineItemDraftDto } from '@/carts/dto/lineitem-draft.dto';
import { AddDiscountCodeDto } from './dto/addDiscountCode.dto';
import { AddDeliveryDateDto, DeliveryDatesQueryDto, DeliveryDatesResponseDto } from '@/business-unit-carts/dto/delivery-dates.dto';
import { PaymentMethodsResponseDto } from './dto/business-unit-payment-methods.dto';
import { plainToClass } from 'class-transformer';
import { VerificationCartRequestArgsDto } from '@/carts/dto/queryargs.dto';
import { MergeCartsDto } from '@/business-unit-carts/dto/merge-carts.dto';
import { AuthorizationHeaders } from '@/common/decorator/headers.decorator';

@AuthorizationHeaders()
@ApiTags('Business Unit Carts')
@Controller('business-unit')
export class BusinessUnitCartsController {
  constructor(private readonly businessUnitsCartsService: BusinessUnitCartsService, private readonly configService: ConfigService) {}

  private userHeaderId = this.configService.get<string>('businessUnitsCarts.userHeaderId');
  private userHeaderRoles = this.configService.get<string>('businessUnitsCarts.userHeaderRoles');

  @ApiOkResponse({ description: 'Active Cart', type: () => AdelcoCartsEntity })
  @ApiBadRequestResponse({ description: 'User ID missing' })
  @ApiNotFoundResponse({ description: 'Cart not found' })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Get(':businessUnitId/carts/active')
  async getActiveCart(@Headers() headers: object, @Param('businessUnitId') businessUnitId: string, @Query() queries?: VerificationCartRequestArgsDto): Promise<AdelcoCart> {
    if (!headers[this.userHeaderId]) {
      throw new BadRequestException('User ID missing');
    }

    const cart = await this.businessUnitsCartsService.getActiveCartByBuId(businessUnitId, headers[this.userHeaderId], JSON.parse(headers[this.userHeaderRoles] || '[]'));

    const { cart: updatedCart, cartUpdates } = await this.businessUnitsCartsService.checkStockAndPriceChanges(cart, businessUnitId, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @AuthorizationParams()
  @ApiOkResponse({ description: 'Active Cart without the line item', type: () => AdelcoCartsEntity })
  @ApiBadRequestResponse({ description: 'User ID missing' })
  @ApiNotFoundResponse({ description: 'Line item not found' })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Delete(':businessUnitId/carts/active/line-items/:lineItemId')
  async deleteLineItem(
    @Headers() headers: object,
    @Param('businessUnitId') businessUnitId: string,
    @Param('lineItemId') lineItemId: string,
    @Query() queries?: VerificationCartRequestArgsDto
  ): Promise<AdelcoCart> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }
    const cart = await this.businessUnitsCartsService.deleteLineItem(
      businessUnitId,
      lineItemId,
      headers[`${this.userHeaderId}`],
      JSON.parse(headers[`${this.userHeaderRoles}`] || '[]')
    );
    const { cart: updatedCart, cartUpdates } = await this.businessUnitsCartsService.checkStockAndPriceChanges(cart, businessUnitId, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @AuthorizationParams()
  @ApiOkResponse({ description: 'Active Cart with the line item quantity updated', type: () => AdelcoCartsEntity })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
    \n * Delivery zone missing data \
    \n * Unable to determine product stock \
    \n * Product is not on stock or there are not enough units'
  })
  @ApiNotFoundResponse({ description: 'Line item not found' })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Patch(':businessUnitId/carts/active/line-items/:lineItemId/quantity')
  async updateLineItemQuantity(
    @Headers() headers: object,
    @Param('businessUnitId') businessUnitId: string,
    @Param('lineItemId') lineItemId: string,
    @Body() body: UpdateLineItemQuantityRequestDto,
    @Query() queries?: VerificationCartRequestArgsDto
  ): Promise<AdelcoCart> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }
    const cart = await this.businessUnitsCartsService.updateLineItemQuantity(
      businessUnitId,
      lineItemId,
      body,
      headers[`${this.userHeaderId}`],
      JSON.parse(headers[`${this.userHeaderRoles}`] || '[]')
    );

    const { cart: updatedCart, cartUpdates } = await this.businessUnitsCartsService.checkStockAndPriceChanges(cart, businessUnitId, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @ApiOkResponse({ description: 'Active Cart with the line items updated', type: () => AdelcoCartsEntity })
  @ApiNotFoundResponse({ description: ' * Product not found \n * Business unit not found' })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
      \n * Business unit missing delivery zone \
      \n * Business unit missing distribution channel \
      \n * Delivery zone missing data \
      \n * Unable to determine product stock \
      \n * Product is not on stock or there are not enough units \
      \n * Missing price for product \
      \n * Missing taxRate for product \
      \n * Invalid sku for product'
  })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Post(':businessUnitId/carts/active/line-items')
  async addLineItems(
    @Headers() headers: object,
    @Param('businessUnitId') businessUnitId: string,
    @Body() lineItemDraft: LineItemDraftDto,
    @Query() queries?: VerificationCartRequestArgsDto
  ): Promise<AdelcoCart> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }
    const cart = await this.businessUnitsCartsService.addLineItems(
      headers[`${this.userHeaderId}`],
      lineItemDraft,
      businessUnitId,
      JSON.parse(headers[`${this.userHeaderRoles}`] || '[]')
    );
    const { cart: updatedCart, cartUpdates } = await this.businessUnitsCartsService.checkStockAndPriceChanges(cart, businessUnitId, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @ApiNoContentResponse({ description: 'Empty body' })
  @HttpCode(204)
  @ApiNotFoundResponse({ description: ' * Business unit not found \n * Active cart not found' })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Delete(':businessUnitId/carts/active')
  async deleteCart(@Headers() headers: object, @Param('businessUnitId') businessUnitId: string): Promise<void> {
    if (!headers[this.userHeaderId]) {
      throw new BadRequestException('User ID missing');
    }
    await this.businessUnitsCartsService.deleteCart(headers[this.userHeaderId], businessUnitId, JSON.parse(headers[this.userHeaderRoles] || '[]'));
  }

  @ApiOkResponse({ description: 'Cart updated', type: () => AdelcoCartsEntity })
  @ApiNotFoundResponse({ description: '* Carts-035: Business unit not found' })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
      \n * User Roles missing \
      \n * Business unit missing delivery zone \
      \n * Business unit missing distribution channel \
      \n * Delivery zone missing data \
      \n * Unable to determine product stock \
      \n * Carts-026: Product is not on stock or there are not enough units \
      \n * Missing price for product \
      \n * Missing taxRate for product \
      \n * Invalid sku for product \
      \n * Carts-028: Discount not found or not applicable \
      \n * Carts-034: Product not found'
  })
  @ApiForbiddenResponse({
    description: '* Insufficient permissions'
  })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Post(':businessUnitId/sync-cart')
  async updateSyncCart(
    @Headers() headers: object,
    @Param('businessUnitId') businessUnitId: string,
    @Body() body: UpdateSyncCartRequestDto,
    @Query() queries?: VerificationCartRequestArgsDto
  ): Promise<AdelcoCart> {
    const userHeaderRoles: string[] = headers[`${this.userHeaderRoles}`];
    const userHeaderId: string = headers[`${this.userHeaderId}`];
    if (!userHeaderId) {
      throw new BadRequestException('User ID missing');
    }
    if (!userHeaderRoles) {
      throw new BadRequestException('User roles missing');
    }
    if (!userHeaderRoles.includes('__INTERNAL__')) {
      throw new ForbiddenException('Insufficient permissions');
    }

    const cart = await this.businessUnitsCartsService.updateSyncCart(userHeaderId, businessUnitId, body, queries?.forceUpdate);

    return cart;
  }

  @ApiOkResponse({ description: 'Updated cart without discount code', type: () => AdelcoCartsEntity })
  @ApiBadRequestResponse({ description: 'User ID missing' })
  @ApiNotFoundResponse({ description: 'Discount code not found' })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @ApiParam({ name: 'discountCodeToRemove', type: 'string', required: true })
  @Delete(':businessUnitId/carts/active/discount-code/:discountCodeToRemove')
  async deleteDiscountCode(
    @Headers() headers: object,
    @Param('businessUnitId') businessUnitId: string,
    @Param('discountCodeToRemove') discountCodeToRemove: string,
    @Query() queries?: VerificationCartRequestArgsDto
  ): Promise<AdelcoCart> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }
    const cart = await this.businessUnitsCartsService.deleteDiscountCode(
      businessUnitId,
      discountCodeToRemove,
      headers[`${this.userHeaderId}`],
      JSON.parse(headers[`${this.userHeaderRoles}`] || '[]')
    );
    const { cart: updatedCart, cartUpdates } = await this.businessUnitsCartsService.checkStockAndPriceChanges(cart, businessUnitId, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @ApiOkResponse({ description: 'Updated cart with discount code', type: () => AdelcoCartsEntity })
  @ApiBadRequestResponse({ description: '* User ID missing \n * If the discount code is invalid/does not exist.' })
  @ApiNotFoundResponse({ description: '* If the customer does not have access to the active cart for the BU or if cart does not exist.' })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Patch(':businessUnitId/carts/active/discount-code')
  async addDiscountCode(
    @Headers() headers: object,
    @Param('businessUnitId') businessUnitId: string,
    @Body() { code }: AddDiscountCodeDto,
    @Query() queries?: VerificationCartRequestArgsDto
  ): Promise<AdelcoCart> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }
    const cart = await this.businessUnitsCartsService.addDiscountCode(
      businessUnitId,
      code,
      headers[`${this.userHeaderId}`],
      JSON.parse(headers[`${this.userHeaderRoles}`] || '[]')
    );
    const { cart: updatedCart, cartUpdates } = await this.businessUnitsCartsService.checkStockAndPriceChanges(cart, businessUnitId, queries?.forceUpdate);
    const adelcoCart = convertToAdelcoFormat(updatedCart);

    return cartUpdates ? { ...adelcoCart, cartUpdates } : adelcoCart;
  }

  @ApiOkResponse({
    description: 'List of delivery dates',
    type: DeliveryDatesResponseDto
  })
  @ApiBadRequestResponse({
    description:
      '* Business Unit not found \
      \n * Data structure data validation does not pass'
  })
  @ApiOperation({ operationId: 'getDeliveryDates', description: 'GET delivery dates' })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get('/:id/carts/active/delivery-dates')
  async getDeliveryDates(@Headers() headers: object, @Param('id') buId: string, @Query() query?: DeliveryDatesQueryDto): Promise<DeliveryDatesResponseDto> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }

    return this.businessUnitsCartsService.getDeliveryDates(buId, query);
  }

  @ApiOkResponse({ description: 'Updated cart with delivery date', type: () => AdelcoCartsEntity })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
          \n * Payload does not have the correct structure'
  })
  @ApiNotFoundResponse({
    description:
      '* If the customer does not have access to the active cart for the BU. \
      \n * BU does not exist.'
  })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Patch(':businessUnitId/carts/active/delivery-dates')
  async addDeliveryDate(@Headers() headers: object, @Param('businessUnitId') businessUnitId: string, @Body() body: AddDeliveryDateDto): Promise<AdelcoCart> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }

    const cart = await this.businessUnitsCartsService.addDeliveryDate(
      businessUnitId,
      body,
      headers[`${this.userHeaderId}`],
      JSON.parse(headers[`${this.userHeaderRoles}`] || '[]')
    );
    return convertToAdelcoFormat(cart);
  }

  @ApiOkResponse({
    description: 'List of payment methods',
    type: PaymentMethodsResponseDto
  })
  @ApiNotFoundResponse({ description: 'Business Unit not found' })
  @ApiForbiddenResponse({ description: 'Insufficient permissions' })
  @ApiOperation({
    operationId: 'getEnabledPaymentMethods',
    description: 'GET enabled payment methods.'
  })
  @ApiParam({ name: 'id', type: 'string', required: true })
  @Get('/:id/active/payment-methods')
  async getEnabledPaymentMethods(@Headers() headers: object, @Param('id') buId: string): Promise<PaymentMethodsResponseDto> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }

    return plainToClass(PaymentMethodsResponseDto, this.businessUnitsCartsService.getEnabledPaymentMethods(buId, headers[`${this.userHeaderId}`]));
  }

  @ApiOkResponse({ description: 'Merge active cart with active anonymous cart', type: () => AdelcoCartsEntity })
  @ApiNotFoundResponse({
    description: '* Carts-035: Business unit not found.'
  })
  @ApiBadRequestResponse({
    description:
      '* User ID missing \
        \n * Anonymous cart (:id) does not have any items. \
        \n * Not found an anonymous active cart. \
        \n * Key not found for business unit :buId. \
        \n * Carts-034: Product not found.'
  })
  @ApiParam({ name: 'businessUnitId', type: 'string', required: true })
  @Post(':businessUnitId/carts/cart-merge-request')
  async mergeCarts(@Headers() headers: object, @Param('businessUnitId') businessUnitId: string, @Body() body: MergeCartsDto): Promise<AdelcoCart> {
    if (!headers[`${this.userHeaderId}`]) {
      throw new BadRequestException('User ID missing');
    }

    return await this.businessUnitsCartsService.mergeCarts(headers[`${this.userHeaderId}`], businessUnitId, body.cartId);
  }
}
