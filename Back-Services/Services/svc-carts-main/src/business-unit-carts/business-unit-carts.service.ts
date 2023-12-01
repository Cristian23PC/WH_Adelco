import { Cart, CartUpdateAction, LineItem, LineItemDraft } from '@commercetools/platform-sdk';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CartsService } from '@/carts/carts.service';
import { BusinessUnitsService } from '@/business-unit/business-units.service';
import { ConvertedBusinessUnit } from '@/business-unit/business-units.interface';
import { SALES_SOURCE_CUSTOM_FIELD, USER_CSR_ROLE, USER_INTERNAL_ROLE } from '@/common/constants/carts';
import { IUpdateLineItemQuantityRequest } from './business-unit-carts.interface';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { CartsHelperService } from '@/carts-helper/carts-helper.service';
import { UpdateSyncCartRequestDto } from './dto/business-units-carts.dto';
import { ChannelsService } from '@/channels/channels.service';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { ValidatorService } from '@/common/validator/validator.service';
import { AddDeliveryDateDto, DeliveryDatesQueryDto } from '@/business-unit-carts/dto/delivery-dates.dto';
import { DeliveryZone } from '@/delivery-zones/models';
import { getNextDeliveryDates } from '@adelco/lib_delivery';
import { DeliveryDatesResponse } from '@adelco/lib_delivery/lib/es5/interfaces/delivery-dates.interface';
import { PaymentMethodsResponseDto } from './dto/business-unit-payment-methods.dto';
import { PaymentsMethodsService } from '@/payments-methods/payment-methods.service';
import { AdelcoCart, convertToAdelcoFormat } from '@adelco/price-calc';
import { LoggerService } from '@/common/utils';
import loggerConfig from '@/config/logger.config';

const defaultExpand = ['lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount', 'discountCodes[*].discountCode'];

const TIME_REGEX = /(?<day>\d{1,2})\/\d{1,2}\/\d{4}, (?<hours>\d{1,2}):(?<minutes>\d{1,2}):\d{1,2}/;

interface MinutesForDay {
  minutes: number;
  day: string;
}

@Injectable()
export class BusinessUnitCartsService {
  private readonly loggerService = new LoggerService(loggerConfig());

  constructor(
    private readonly businessUnitService: BusinessUnitsService,
    private readonly cartsService: CartsService,
    private readonly deliveryZoneService: DeliveryZonesService,
    private readonly channelsService: ChannelsService,
    private readonly cartsHelperService: CartsHelperService,
    private readonly validatorService: ValidatorService,
    private readonly paymentsMethodsService: PaymentsMethodsService
  ) {}

  async getActiveCartByBuId(buId: string, userId: string, userRoles?: string[]): Promise<Cart> {
    const { key: buKey } = await this.getBusinessUnit(buId, userId, userRoles);
    return await this.getActiveCart(buKey, userId, userRoles, defaultExpand);
  }

  async getActiveCart(buKey: string, userId: string, userRoles?: string[], expand?: string[]): Promise<Cart> {
    let cart: Cart;
    if (userRoles?.some(role => role === USER_CSR_ROLE)) {
      cart = await this.cartsService.getActiveCart(userId, buKey, expand);
    } else if (userRoles?.some(role => role === USER_INTERNAL_ROLE)) {
      cart = await this.cartsService.getByBusinessUnitKey(userId, buKey);
    } else if (!cart) {
      cart = await this.cartsService.getActiveCart(userId, buKey, expand);
    }
    return cart;
  }

  async getBusinessUnit(buId: string, userId: string, userRoles?: string[], validateUserAccess = false): Promise<ConvertedBusinessUnit> {
    let businessUnit: ConvertedBusinessUnit;
    if (userRoles?.some(role => [USER_INTERNAL_ROLE, USER_CSR_ROLE].includes(role)) || !validateUserAccess) {
      businessUnit = await this.businessUnitService.getBusinessUnitById(buId);
    } else {
      businessUnit = await this.businessUnitService.findBusinessUnitByIdAndCustomer(buId, userId);
    }
    return businessUnit;
  }

  async addLineItems(userId: string, lineItemDraft: LineItemDraft, buId: string, userRoles?: string[]): Promise<Cart> {
    const businessUnit = await this.getBusinessUnit(buId, userId, userRoles, true);

    const { distributionChannelId, taxProfile, shouldApplyT2Rate, distributionCenter, t2Rate, key, externalId, rut } = businessUnit;
    let activeCart: Cart;

    try {
      activeCart = await this.getActiveCart(businessUnit.key, userId, userRoles, defaultExpand);
    } catch (e) {}

    const { productsDraft, lineItemsIdsToDelete } = await this.cartsHelperService.getProductsDraftAndLineItemsIdsToDelete({
      lineItemsDraft: [lineItemDraft],
      cart: activeCart,
      distributionChannelId,
      taxProfile,
      shouldApplyT2Rate,
      dcCode: distributionCenter,
      t2Rate: t2Rate
    });

    const expand = defaultExpand;
    let cart;
    if (!activeCart) {
      cart = await this.cartsService.create(
        { lineItems: productsDraft, shippingAddress: { ...this.cartsHelperService.getBusinessUnitShippingAddress(businessUnit), email: userId } },
        userId,
        buId,
        key,
        rut,
        externalId,
        { expand }
      );
    } else if (productsDraft.length + lineItemsIdsToDelete.length !== 0) {
      cart = await this.cartsService.addLineItems(activeCart.id, activeCart.version, productsDraft, lineItemsIdsToDelete, {
        expand
      });
    }
    return cart;
  }

  async deleteDiscountCode(buId: string, discountCodeToRemove: string, userId: string, userRoles?: string[]): Promise<Cart> {
    const businessUnit = await this.getBusinessUnit(buId, userId, userRoles);
    const { id, version, discountCodes } = await this.getActiveCart(businessUnit.key, userId, userRoles, defaultExpand);

    const oldCode = discountCodes.find(({ discountCode }) => discountCode.obj.code === discountCodeToRemove);

    if (!oldCode) {
      throw ErrorBuilder.buildError('discountCodeDoesNotExist');
    }

    const actions: CartUpdateAction[] = [
      {
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discount-code',
          id: oldCode.discountCode.id
        }
      }
    ];

    return await this.cartsService.updateCart(id, version, actions, { expand: defaultExpand });
  }

  async addDiscountCode(buId: string, code: string, userId: string, userRoles?: string[]): Promise<Cart> {
    const businessUnit = await this.getBusinessUnit(buId, userId, userRoles);
    const { id, version } = await this.getActiveCart(businessUnit.key, userId, userRoles, defaultExpand);

    const actions: CartUpdateAction[] = [
      {
        action: 'addDiscountCode',
        code
      }
    ];

    return await this.cartsService.updateCart(id, version, actions, { expand: defaultExpand });
  }

  async deleteLineItem(buId: string, lineItemId: string, userId: string, userRoles?: string[]): Promise<Cart> {
    const businessUnit = await this.getBusinessUnit(buId, userId, userRoles);
    const { cart, lineItem } = await this.getCartAndLineItem(businessUnit.key, lineItemId, userId, userRoles);
    return this.cartsService.removeLineItemAndSetCartCustomField(cart.id, lineItemId, cart.version, cart.custom?.fields?.uniqueSkuCount, lineItem.variant?.sku);
  }

  async updateLineItemQuantity(id: string, lineItemId: string, { quantity }: IUpdateLineItemQuantityRequest, userId: string, userRoles?: string[]): Promise<Cart> {
    const businessUnit = await this.getBusinessUnit(id, userId, userRoles);

    const [{ cart, lineItem }, { dcCode }, supplyChannels] = await Promise.all([
      this.getCartAndLineItem(businessUnit.key, lineItemId, userId, userRoles),
      this.deliveryZoneService.getAndValidateDeliveryZone(businessUnit.deliveryZoneKey),
      this.channelsService.getSupplyChannels()
    ]);

    this.cartsHelperService.validateStock(lineItem.variant, dcCode, quantity, supplyChannels);

    return this.cartsService.updateLineItemQuantity(quantity, cart.id, lineItem, cart.version, {
      expand: defaultExpand
    });
  }

  async deleteCart(userId: string, id: string, userRoles?: string[]): Promise<void> {
    let businessUnit: ConvertedBusinessUnit;
    if (userRoles?.some(role => role === USER_CSR_ROLE)) {
      businessUnit = await this.businessUnitService.getBusinessUnitById(id);
    } else {
      businessUnit = await this.businessUnitService.findBusinessUnitByIdAndCustomer(id, userId);
    }
    const activeCart = await this.cartsService.getActiveCart(userId, businessUnit.key);
    await this.cartsService.deleteCart(activeCart.id, activeCart.version);
  }

  private async getCart(buKey: string, userId: string, userRoles?: string[]): Promise<Cart> {
    return this.getActiveCart(buKey, userId, userRoles);
  }

  private async getCartAndLineItem(buKey: string, lineItemId: string, userId: string, userRoles: string[]): Promise<{ cart: Cart; lineItem: LineItem }> {
    const cart = await this.getCart(buKey, userId, userRoles);
    const lineItem = cart.lineItems.find(lineItem => lineItem.id === lineItemId);
    if (!lineItem) {
      throw new NotFoundException('Line item not found');
    }

    return { cart, lineItem };
  }

  async updateSyncCart(userId: string, businessUnitId: string, body: UpdateSyncCartRequestDto, forceUpdate = false): Promise<AdelcoCart> {
    const { businessUnit, activeCart } = await this.getBusinessUnitAndActiveCart(businessUnitId, userId);
    return this.createOrMergeACartByLineItems(userId, activeCart, businessUnit, body, forceUpdate);
  }

  async createOrMergeACartByLineItems(
    userId: string,
    activeCart: Cart,
    businessUnit: ConvertedBusinessUnit,
    body: UpdateSyncCartRequestDto,
    forceUpdate = false
  ): Promise<AdelcoCart> {
    const { distributionChannelId, taxProfile, key, shouldApplyT2Rate, distributionCenter, t2Rate, externalId, rut } = businessUnit;

    let isUpdateLastVerificationTime = false;

    if (activeCart) {
      isUpdateLastVerificationTime = forceUpdate || this.cartsHelperService.checkIfLastVerificationIsOlderMaxConfig(activeCart);
    }

    const productsDraftAndLineItemsIdsToDelete = await this.cartsHelperService.getProductsDraftAndLineItemsIdsToDelete({
      lineItemsDraft: body.lineItems as LineItemDraft[],
      cart: activeCart,
      distributionChannelId,
      taxProfile,
      isSyncCart: true,
      shouldApplyT2Rate,
      dcCode: distributionCenter,
      t2Rate: t2Rate,
      isUpdateLastVerificationTime
    });

    const expand = [...defaultExpand];
    if (!activeCart) {
      // TODO: We need to add the paymentMethod when implement payment part.
      return convertToAdelcoFormat(
        await this.cartsService.create(
          {
            shippingAddress: {
              ...this.cartsHelperService.getBusinessUnitShippingAddress(businessUnit),
              email: businessUnit.associates.length > 0 ? businessUnit.associates[0].customer.obj.email : undefined
            },
            lineItems: productsDraftAndLineItemsIdsToDelete.productsDraft,
            discountCodes: body.discountCodes
          },
          userId,
          businessUnit.id,
          key,
          rut,
          externalId,
          {
            expand
          },
          SALES_SOURCE_CUSTOM_FIELD
        )
      );
    } else {
      const syncCartActions = this.cartsHelperService.buildSyncCartActions(activeCart, productsDraftAndLineItemsIdsToDelete, body.discountCodes, body.paymentMethod);

      const lastVerificationTimeActions = isUpdateLastVerificationTime ? this.cartsHelperService.buildLastVerificationTimeActions() : [];

      const updateActions = [...syncCartActions, ...lastVerificationTimeActions];

      //TODO: Calcula cartUpdate field.

      if (updateActions.length) {
        const updatedCart = convertToAdelcoFormat(
          await this.cartsService.updateCart(activeCart.id, activeCart.version, updateActions, {
            expand
          })
        );

        const { isQuantityUpdated, isPriceUpdated } = productsDraftAndLineItemsIdsToDelete;

        return {
          ...updatedCart,
          ...(isQuantityUpdated || isPriceUpdated ? { cartUpdates: { isQuantityUpdated, isPriceUpdated } } : {})
        };
      } else {
        return convertToAdelcoFormat(activeCart);
      }
    }
  }

  private async getBusinessUnitAndActiveCart(businessUnitId: string, userId: string) {
    const businessUnit = await this.businessUnitService.getBusinessUnitById(businessUnitId);
    if (!businessUnit?.key) {
      throw new NotFoundException(`Key not found for business unit ${businessUnitId}`);
    }
    let activeCart: Cart;

    try {
      activeCart = await this.cartsService.getByBusinessUnitKey(userId, businessUnit.key);
    } catch (e) {}

    return {
      businessUnit,
      activeCart
    };
  }

  private getMinutesFromFormattedDate(formattedDate: string): MinutesForDay {
    const { day, hours, minutes } = TIME_REGEX.exec(formattedDate).groups;

    return {
      minutes: Number.parseInt(hours) * 60 + Number.parseInt(minutes),
      day
    };
  }

  private calculateSantiagoUtcOffsetInMinutes(): number {
    const now = new Date();
    const nowWithSantiagoOffset = now.toLocaleString('es', { timeZone: 'America/Santiago' });
    const { day, minutes } = this.getMinutesFromFormattedDate(nowWithSantiagoOffset);

    const nowWithoutOffset = now.toLocaleString('es', { timeZone: 'Etc/GMT0' });
    const { day: utcDay, minutes: utcMinutes } = this.getMinutesFromFormattedDate(nowWithoutOffset);

    if (day === utcDay) {
      return minutes - utcMinutes;
    } else {
      return minutes - 24 * 60 - utcMinutes;
    }
  }

  async getDeliveryDates(buId: string, { options }: DeliveryDatesQueryDto): Promise<DeliveryDatesResponse> {
    const businessUnit = await this.businessUnitService.getBusinessUnitById(buId);
    const deliveryZone = await this.deliveryZoneService.getT2Zone(businessUnit.deliveryZoneKey);
    const utcOffset = this.calculateSantiagoUtcOffsetInMinutes();

    this.validatorService.validate(DeliveryZone, deliveryZone.value);
    return getNextDeliveryDates(deliveryZone.value, options, utcOffset);
  }

  async addDeliveryDate(buId: string, { date }: AddDeliveryDateDto, userId: string, userRoles: string[]): Promise<Cart> {
    const { key: buKey } = await this.getBusinessUnit(buId, userId, userRoles);
    const { id: cartId, version } = await this.getActiveCart(buKey, userId, userRoles);

    const actions: CartUpdateAction[] = [
      {
        action: 'setCustomField',
        name: 'deliveryDate',
        value: date
      }
    ];

    return await this.cartsService.updateCart(cartId, version, actions, { expand: defaultExpand });
  }

  async getEnabledPaymentMethods(buId: string, userId: string): Promise<PaymentMethodsResponseDto> {
    const { businessUnits } = await this.businessUnitService.getBusinessUnitsForCustomer(userId);
    const businessUnit = businessUnits.find(bu => bu.id === buId);
    if (!businessUnit) {
      throw ErrorBuilder.buildError('buNotFound');
    }
    let company = businessUnit;
    if (businessUnit.unitType === 'Division') {
      company = businessUnits.find(bu => bu.key === businessUnit.topLevelUnit.key);
    }
    const creditLineDetails = {
      creditLimit: company.creditLimit ?? 0,
      creditTermDays: company.creditTermDays ?? 0,
      creditExcessTolerance: company.creditExcessTolerance ?? 0,
      isCreditBlocked: company.isCreditBlocked || businessUnit.isCreditBlocked,
      isCreditEnabled: company.isCreditEnabled ?? false
    };

    return await this.paymentsMethodsService.getEnabledPaymentMethods(creditLineDetails.isCreditEnabled, creditLineDetails);
  }

  async checkStockAndPriceChanges(
    cart: Cart,
    businessUnitId: string,
    forceUpdate?: boolean
  ): Promise<{ cart: Cart; cartUpdates?: { isQuantityUpdated: boolean; isPriceUpdated: boolean } }> {
    const isUpdateLastVerificationTime = forceUpdate || this.cartsHelperService.checkIfLastVerificationIsOlderMaxConfig(cart);

    if (isUpdateLastVerificationTime) {
      const businessUnit = await this.businessUnitService.getBusinessUnitById(businessUnitId);
      const { deliveryZoneKey, distributionChannelId, taxProfile, shouldApplyT2Rate } = businessUnit;
      const { dcCode, t2Rate } = await this.deliveryZoneService.getAndValidateDeliveryZone(deliveryZoneKey);

      const { isQuantityUpdated, isPriceUpdated, updatedActions } = await this.cartsHelperService.verifyPricesAndStock(
        cart,
        dcCode,
        t2Rate,
        distributionChannelId,
        taxProfile,
        shouldApplyT2Rate
      );

      const updatedCart = await this.cartsService.updateCart(cart.id, cart.version, [...updatedActions, ...this.cartsHelperService.buildLastVerificationTimeActions()], {
        expand: defaultExpand
      });

      return {
        cart: updatedCart,
        cartUpdates: { isQuantityUpdated, isPriceUpdated }
      };
    }

    return {
      cart
    };
  }

  async mergeCarts(userId: string, businessUnitId: string, anonymousCartId: string): Promise<AdelcoCart> {
    const { businessUnit, activeCart } = await this.getBusinessUnitAndActiveCart(businessUnitId, userId);
    const anonymousActiveCart = await this.cartsService.getActiveCartById(anonymousCartId, true);

    const lineItemsDraft = this.cartsHelperService.getLineItemsToAdd(anonymousActiveCart, activeCart);

    const mergedCart = await this.createOrMergeACartByLineItems(userId, activeCart, businessUnit, { lineItems: lineItemsDraft } as UpdateSyncCartRequestDto);

    await this.cartsService.deleteCart(anonymousActiveCart.id, anonymousActiveCart.version);

    if (!activeCart) {
      mergedCart.cartUpdates = {
        ...mergedCart.cartUpdates,
        isCartMerged: true
      } as AdelcoCart['cartUpdates'];
    }

    return mergedCart;
  }
}
