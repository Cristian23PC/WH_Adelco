import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { ProductsService } from '@/products/products.service';
import {
  Address,
  Cart,
  CartAddDiscountCodeAction,
  CartAddLineItemAction,
  CartChangeLineItemQuantityAction,
  CartRemoveDiscountCodeAction,
  CartRemoveLineItemAction,
  CartSetLineItemPriceAction,
  CartUpdateAction,
  Channel,
  CustomObject,
  DiscountCodeInfo,
  LineItemDraft,
  ProductVariant
} from '@commercetools/platform-sdk';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IGetProductForCartRequest, IGetProductsDraftAndLineItemsIdsToDeleteRequest, IGetProductsDraftAndLineItemsIdsToDeleteResponse } from './carts-helper.interface';
import { ChannelsService } from '@/channels/channels.service';
import { calculatePriceForCTCart, PriceForCTCart, TaxProfile } from '@adelco/price-calc';
import { ConfigService } from '@nestjs/config';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { ECOMM_SOURCE_CUSTOM_FIELD } from '@/common/constants/carts';

@Injectable()
export class CartsHelperService {
  constructor(
    private readonly deliveryZoneService: DeliveryZonesService,
    private readonly productsService: ProductsService,
    private readonly channelsService: ChannelsService,
    private readonly configService: ConfigService
  ) {}

  private priceCurrency = this.configService.get<string>('cartsHelper.priceCurrency');

  validateStock(variant: ProductVariant, dcCode: string, quantity: number, supplyChannels: Channel[]): void {
    const matchingChannel = supplyChannels.find(channel => channel.key === dcCode);
    if (!matchingChannel) {
      throw new BadRequestException(`Supply channel ${dcCode} not found`);
    }

    const matchingAvailability = variant?.availability?.channels?.[matchingChannel.id];
    if (!matchingAvailability) {
      throw ErrorBuilder.buildError('noStock', { sku: variant?.sku, dcCode, quantity, availableQuantity: 0 });
    }

    if (!matchingAvailability.isOnStock) {
      throw ErrorBuilder.buildError('noStock', { sku: variant?.sku, dcCode, quantity, availableQuantity: 0 });
    }

    if (matchingAvailability.availableQuantity < quantity) {
      throw ErrorBuilder.buildError('noStock', { sku: variant?.sku, dcCode, quantity, availableQuantity: matchingAvailability.availableQuantity });
    }
  }

  getProductForCart({
    sku,
    products,
    dcCode,
    distributionChannelId,
    t2Rate,
    newQuantity = 1,
    oldQuantity = 0,
    taxProfile = '1',
    isSyncCart,
    shouldApplyT2Rate,
    supplyChannels
  }: IGetProductForCartRequest): LineItemDraft {
    const prodWithBasePrice = products.find(product => product.masterVariant.sku === sku || product.variants.find(v => v.sku === sku));

    if (!prodWithBasePrice) {
      throw ErrorBuilder.buildError('productNotFound', {
        sku,
        dcCode,
        distributionChannelId
      });
    }
    const variant = prodWithBasePrice.masterVariant?.sku === sku ? prodWithBasePrice.masterVariant : prodWithBasePrice.variants?.find(v => v.sku === sku);

    this.validateStock(variant, dcCode, newQuantity, supplyChannels);
    let productPriceForCart: PriceForCTCart;
    try {
      productPriceForCart = calculatePriceForCTCart({
        product: prodWithBasePrice,
        t2Rate: parseFloat(t2Rate),
        sku: sku,
        taxProfile: taxProfile as TaxProfile,
        shouldApplyT2Rate
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const supplyChannelId = this.getSupplyChannelId(supplyChannels, dcCode);

    return {
      sku: sku,
      quantity: isSyncCart ? newQuantity : oldQuantity + newQuantity,
      externalPrice: {
        currencyCode: this.priceCurrency,
        centAmount: productPriceForCart.price
      },
      externalTaxRate: productPriceForCart.taxRate,
      supplyChannel: {
        typeId: 'channel',
        id: supplyChannelId
      },
      custom: {
        type: {
          typeId: 'type',
          key: 'adelco-line-item-type'
        },
        fields: {
          productDiscount: productPriceForCart.productDiscount ? JSON.stringify(productPriceForCart.productDiscount) : undefined,
          t2UnitAmount: productPriceForCart.unitT2charge
        }
      }
    };
  }

  async getProductsDraftAndLineItemsIdsToDelete({
    lineItemsDraft,
    cart,
    distributionChannelId,
    taxProfile = '1',
    isSyncCart,
    shouldApplyT2Rate,
    dcCode,
    t2Rate,
    isUpdateLastVerificationTime
  }: IGetProductsDraftAndLineItemsIdsToDeleteRequest): Promise<IGetProductsDraftAndLineItemsIdsToDeleteResponse> {
    const supplyChannels = await this.channelsService.getSupplyChannels();
    let isQuantityUpdated = false,
      isPriceUpdated = false;

    const lineItemsIdsToDelete: string[] = cart?.lineItems
      ?.filter(lineItem => lineItemsDraft.some(lineDraft => lineItem?.variant?.sku === lineDraft.sku))
      .map(lineItem => lineItem.id);

    const skus = lineItemsDraft.map(lineItem => lineItem.sku);
    const productsWithBasePrice = await this.productsService.findAllProducts(skus, dcCode, distributionChannelId);

    const lineItemsWithExternalPriceDrafts = lineItemsDraft
      .map(lineItemDraft => {
        let newQuantity = lineItemDraft.quantity;
        const existingLineItem = cart?.lineItems?.find(lineItem => lineItem?.variant?.sku === lineItemDraft.sku);
        if (isSyncCart && isUpdateLastVerificationTime && existingLineItem) {
          const sku = existingLineItem.variant.sku;
          const variantWithStock = productsWithBasePrice.flatMap(product => [product.masterVariant, ...product.variants]).find(variant => variant.sku === sku);

          if (!variantWithStock) {
            throw ErrorBuilder.buildError('productNotFound', {
              sku,
              dcCode,
              distributionChannelId
            });
          }

          const { availableQuantity } = variantWithStock.availability.channels[existingLineItem.supplyChannel.id];

          const quantityNotChanged = existingLineItem.quantity === newQuantity;

          if (quantityNotChanged && newQuantity > availableQuantity) {
            newQuantity = availableQuantity;
            isQuantityUpdated = true;
          }

          if (quantityNotChanged && newQuantity === 0) {
            isQuantityUpdated = true;
            return;
          }
        }

        const productForCart = this.getProductForCart({
          sku: lineItemDraft.sku,
          products: productsWithBasePrice,
          dcCode,
          t2Rate,
          newQuantity,
          oldQuantity: existingLineItem?.quantity,
          taxProfile,
          isSyncCart,
          shouldApplyT2Rate,
          supplyChannels,
          distributionChannelId
        });

        if (isUpdateLastVerificationTime && existingLineItem) {
          if (productForCart.externalPrice.centAmount !== existingLineItem.price.value.centAmount) {
            isPriceUpdated = true;
          }
        }

        return productForCart;
      })
      .filter(x => !!x);

    return {
      productsDraft: lineItemsWithExternalPriceDrafts,
      lineItemsIdsToDelete: isSyncCart && cart ? cart.lineItems.map(lineItem => lineItem.id) : lineItemsIdsToDelete,
      isQuantityUpdated,
      isPriceUpdated
    };
  }

  async getDefaultDistributionChannelForDeliveryZone(customObjects: Partial<CustomObject>[]): Promise<string> {
    const defaultDistributionCenters = customObjects.reduce((acc: string[], obj: { value: object }) => {
      const distributionCenter = obj.value['dcCode'];
      return distributionCenter && !acc.includes(distributionCenter) ? [...acc, distributionCenter] : acc;
    }, []);
    for (const dcCode of defaultDistributionCenters) {
      const channel = await this.channelsService.getDefaultChannelForDistributionCenter(dcCode);
      if (channel) {
        return channel.id;
      }
    }
    return undefined;
  }

  buildSyncCartActions(
    { discountCodes }: Cart,
    { productsDraft, lineItemsIdsToDelete }: IGetProductsDraftAndLineItemsIdsToDeleteResponse,
    newDiscountCodes?: string[],
    paymentMethod?: string
  ): CartUpdateAction[] {
    const discountCodesActions = this.buildDiscountCodesActions(discountCodes, newDiscountCodes);
    const paymentMethodActios = this.buildPaymentMethodActions(paymentMethod);
    const lineItemActions = this.buildLineItemActions(productsDraft, lineItemsIdsToDelete);
    const customFieldActions = this.buildCustomFieldActions(productsDraft);

    return [...discountCodesActions, ...paymentMethodActios, ...lineItemActions, ...customFieldActions];
  }

  buildLineItemActions(lineItemDrafts: LineItemDraft[], lineItemIdsToDelete: string[]): (CartAddLineItemAction | CartRemoveLineItemAction)[] {
    const addActions: CartAddLineItemAction[] = lineItemDrafts.map(lineItemDraft => {
      return {
        action: 'addLineItem',
        ...lineItemDraft
      };
    });
    const removeActions: CartRemoveLineItemAction[] = lineItemIdsToDelete.map(lineItemId => {
      return {
        action: 'removeLineItem',
        lineItemId
      };
    });

    return [...addActions, ...removeActions];
  }

  buildDiscountCodesActions(oldDiscountCodes: DiscountCodeInfo[], discountCodes?: string[]): CartUpdateAction[] {
    return [...this.buildRemoveDiscountCodeActions(oldDiscountCodes, discountCodes || []), ...this.buildAddDiscountCodeActions(oldDiscountCodes, discountCodes || [])];
  }

  private buildRemoveDiscountCodeActions(oldDiscountCodes: DiscountCodeInfo[], discountCodes?: string[]): CartRemoveDiscountCodeAction[] {
    return oldDiscountCodes
      .filter(curr => !discountCodes?.includes(curr.discountCode.obj.code))
      .map(curr => ({
        action: 'removeDiscountCode',
        discountCode: {
          typeId: 'discount-code',
          id: curr.discountCode.id
        }
      }));
  }

  private buildAddDiscountCodeActions(oldDiscountCodes: DiscountCodeInfo[], discountCodes?: string[]): CartAddDiscountCodeAction[] {
    return discountCodes
      .filter(curr => !oldDiscountCodes.some(old => old.discountCode.obj.code === curr))
      .map(curr => ({
        action: 'addDiscountCode',
        code: curr
      }));
  }

  private getSupplyChannelId(supplyChannels: Channel[], dcCode: string): string {
    return supplyChannels.find(supplyChannel => supplyChannel.key.toLowerCase() === dcCode.toLowerCase())?.id;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private buildPaymentMethodActions(paymentMethod?: string): [] {
    // TODO: Need to create the payment here, we are going to do when do Payments part.
    return [];
  }

  getBusinessUnitShippingAddress(businessUnit): Address {
    const { defaultShippingAddressId, addresses = [], shippingAddressIds = [] } = businessUnit;

    const shippingAddressId = defaultShippingAddressId || shippingAddressIds[0];

    const shippingAddress = addresses.find(address => address.id === shippingAddressId) ?? addresses[0];

    return shippingAddress;
  }

  checkIfLastVerificationIsOlderMaxConfig(cart: Cart): boolean {
    const salesCartVerificationTimeMinutes = this.configService.get<number>('cartsHelper.salesCartVerificationTimeMinutes');
    const ecommerceCartVerificationTimeMinutes = this.configService.get<number>('cartsHelper.ecommerceCartVerificationTimeMinutes');
    const cartSource = cart.custom?.fields.source ?? ECOMM_SOURCE_CUSTOM_FIELD;
    const cartDate = cart.custom?.fields.lastVerificationTime ? new Date(cart.custom?.fields.lastVerificationTime) : undefined;
    let maxLimitVerificationDate = undefined;
    const currentDate = new Date();

    if (cartDate) {
      maxLimitVerificationDate = new Date(cartDate);
      const maxLastVerificationTimeMinutes = cartSource === ECOMM_SOURCE_CUSTOM_FIELD ? ecommerceCartVerificationTimeMinutes : salesCartVerificationTimeMinutes;
      maxLimitVerificationDate.setMinutes(cartDate.getMinutes() + maxLastVerificationTimeMinutes);
    }

    return !cartDate || currentDate > maxLimitVerificationDate;
  }

  async verifyPricesAndStock(cart: Cart, dcCode: string, t2Rate: string, distributionChannelId: string, taxProfile = '1', shouldApplyT2Rate?: boolean) {
    const updatedPricesAction: CartSetLineItemPriceAction[] = [];
    const updatedQuantitiesAction: (CartChangeLineItemQuantityAction | CartRemoveLineItemAction)[] = [];

    if (cart.lineItems.length > 0) {
      const skus = cart.lineItems.map(lineItem => lineItem.variant.sku);
      const productsWithBasePrice = await this.productsService.findAllProducts(skus, dcCode, distributionChannelId);

      for (const lineItem of cart.lineItems) {
        const productWithBasePrice = productsWithBasePrice.find(product => [product.masterVariant, ...product.variants].some(variant => variant.sku === lineItem.variant.sku));

        if (!productWithBasePrice) {
          updatedQuantitiesAction.push({ action: 'removeLineItem', lineItemId: lineItem.id });
          continue;
        }
        const productPrice = calculatePriceForCTCart({
          product: productWithBasePrice,
          t2Rate: parseFloat(t2Rate),
          sku: lineItem.variant.sku,
          taxProfile: taxProfile as TaxProfile,
          shouldApplyT2Rate
        });

        const externalPrice = { centAmount: productPrice.price, currencyCode: lineItem.price.value.currencyCode };

        if (productPrice.price !== lineItem.price.value.centAmount) {
          updatedPricesAction.push({ action: 'setLineItemPrice', lineItemId: lineItem.id, externalPrice });
        }

        const variantWithStock = [productWithBasePrice.masterVariant, ...productWithBasePrice.variants].find(variant => variant.sku === lineItem.variant.sku);

        const { availableQuantity } = variantWithStock.availability.channels[lineItem.supplyChannel.id];

        if (availableQuantity > 0 && lineItem.quantity > availableQuantity) {
          updatedQuantitiesAction.push({ action: 'changeLineItemQuantity', lineItemId: lineItem.id, quantity: availableQuantity, externalPrice });
        }

        if (availableQuantity === 0) {
          updatedQuantitiesAction.push({ action: 'removeLineItem', lineItemId: lineItem.id });
        }
      }
    }

    return {
      isQuantityUpdated: updatedQuantitiesAction.length > 0,
      isPriceUpdated: updatedPricesAction.length > 0,
      updatedActions: [...updatedPricesAction, ...updatedQuantitiesAction]
    };
  }

  buildLastVerificationTimeActions(): CartUpdateAction[] {
    return [{ action: 'setCustomField', name: 'lastVerificationTime', value: new Date().toISOString() }];
  }

  getLineItemsToAdd(anonymousCart: Cart, cart?: Cart): LineItemDraft[] {
    if (cart) {
      return this.getLineItemsToAddIntoActiveCart(anonymousCart, cart);
    }
    return anonymousCart.lineItems.map(item => ({ sku: item.variant.sku, quantity: item.quantity }));
  }

  getLineItemsToAddIntoActiveCart(anonymousCart: Cart, cart: Cart): LineItemDraft[] {
    const cartItemsMap = new Map(cart.lineItems.map(item => [item.variant.sku, item.quantity]));
    const anonymousCartItemsMap = new Map(anonymousCart.lineItems.map(item => [item.variant.sku, item.quantity]));

    const allSkus = new Set([...cartItemsMap.keys(), ...anonymousCartItemsMap.keys()]);

    return Array.from(allSkus).map(sku => {
      const cartQuantity = cartItemsMap.get(sku) || 0;
      const anonCartQuantity = anonymousCartItemsMap.get(sku) || 0;

      return { sku, quantity: Math.max(cartQuantity, anonCartQuantity) };
    });
  }

  buildCustomFieldActions(lineItemDrafts: LineItemDraft[]): CartUpdateAction[] {
    return [
      {
        action: 'setCustomField',
        name: 'uniqueSkuCount',
        value: lineItemDrafts.length
      }
    ];
  }
}
