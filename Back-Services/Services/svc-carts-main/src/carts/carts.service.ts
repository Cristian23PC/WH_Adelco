import { InjectRepository } from '@/nest-commercetools';
import { BusinessUnit, Cart, CartChangeLineItemQuantityAction, CartDraft, CartUpdateAction, CustomObject, LineItem, LineItemDraft } from '@commercetools/platform-sdk';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CartsRepository } from 'commercetools-sdk-repositories';
import { QueryArgsDto } from './dto/queryargs.dto';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { CartsHelperService } from '@/carts-helper/carts-helper.service';
import { ChannelsService } from '@/channels/channels.service';
import { ECOMM_SOURCE_CUSTOM_FIELD } from '@/common/constants/carts';
import { IDeliveryZoneValue } from '@/delivery-zones/delivery-zones.interface';
import { OrderContactRequestDto } from './dto/orderContactRequest';
import { LoggerService } from '@/common/utils';
import loggerConfig from '@/config/logger.config';
import { BusinessUnitsService } from '@/business-unit/business-units.service';
import { CustomersService } from '@/customers/customers.service';
import { ConvertedBusinessUnit } from '@/business-unit/business-units.interface';
import { NotificationsService } from '@/notifications';
import { buildTemplateData } from '@/common/utils/templates/build-template-data';
import { convertToAdelcoFormat } from '@adelco/price-calc';
import { MAIL_NOTIFICATION_TOPIC } from '@/common/constants/topics';
import { formatRut } from '@/common/formatter/formatter';

const defaultExpand = ['custom.fields.deliveryZone', 'lineItems[*].discountedPricePerQuantity[*].discountedPrice.includedDiscounts[*].discount'];

@Injectable()
export class CartsService {
  private readonly loggerService = new LoggerService(loggerConfig());

  constructor(
    @InjectRepository(CartsRepository)
    private readonly cartsRepository: CartsRepository,
    private readonly deliveryZoneService: DeliveryZonesService,
    private readonly channelsService: ChannelsService,
    private readonly cartsHelperService: CartsHelperService,
    private readonly configService: ConfigService,
    private readonly businessUnitService: BusinessUnitsService,
    private readonly customerService: CustomersService,
    private readonly notificationsService: NotificationsService
  ) {}

  private readonly csrEmail = this.configService.get<string>('cart.csrEmail');

  async orderContactRequest(anonymousId: string, orderContactRequest: OrderContactRequestDto) {
    const cart = await this.getActiveCartByAnonymousId(anonymousId);
    const adelcoCart = convertToAdelcoFormat(cart);

    this.loggerService.log(`[Cart ID]: ${adelcoCart.id} and orderContact ${JSON.stringify(orderContactRequest)}`);

    let businessUnit: BusinessUnit | ConvertedBusinessUnit = await this.businessUnitService.findByRut(formatRut(orderContactRequest.rut));

    if (!businessUnit) {
      if (orderContactRequest.username) {
        const customer = await this.customerService.getCustomerByEmail(orderContactRequest.username);
        const businessUnitCustomer = await this.businessUnitService.findBusinessUnitByAssociateId(customer?.id);
        if (businessUnitCustomer) {
          businessUnit = await this.businessUnitService.repRegistration({ ...orderContactRequest, username: undefined }, true);
        } else {
          businessUnit = await this.businessUnitService.repRegistration({ ...orderContactRequest, username: orderContactRequest.username }, false);
        }
      } else {
        businessUnit = await this.businessUnitService.repRegistration({ ...orderContactRequest, username: orderContactRequest?.username }, true);
      }
    }

    const templateData = buildTemplateData(adelcoCart, orderContactRequest, businessUnit.key);

    await this.notificationsService.sendNotification(
      {
        to: [{ email: this.csrEmail, name: 'n/a' }],
        notificationType: 'ORDER_CONTACT_REQUEST',
        templateData
      },
      MAIL_NOTIFICATION_TOPIC
    );

    return;
  }

  async create(
    cartDraft: Partial<CartDraft>,
    userId: string,
    buId: string,
    buKey: string,
    rut: string,
    externalId?: string,
    queryArgs?: QueryArgsDto,
    source = ECOMM_SOURCE_CUSTOM_FIELD
  ): Promise<Cart> {
    const draft: CartDraft = {
      ...cartDraft,
      currency: this.configService.get<string>('cart.currency'),
      taxRoundingMode: 'HalfUp',
      taxCalculationMode: 'LineItemLevel',
      custom: {
        type: {
          typeId: 'type',
          key: 'adelco-cart-type'
        },
        fields: {
          uniqueSkuCount: cartDraft.lineItems?.length ?? 0,
          createdBy: userId,
          source,
          ctBuId: buId,
          buKey: buKey,
          sapBuId: externalId,
          buRut: rut
        }
      },
      taxMode: 'External',
      inventoryMode: 'ReserveOnOrder',
      businessUnit: {
        typeId: 'business-unit',
        id: buId
      }
    };
    return await this.cartsRepository.create({
      queryArgs,
      body: draft
    });
  }

  async createAnonymous(cartDraft: Partial<CartDraft>, anonymousId: string, deliveryZoneId: string, queryArgs?: QueryArgsDto): Promise<Cart> {
    const body: CartDraft = {
      ...cartDraft,
      currency: this.configService.get<string>('cart.currency'),
      anonymousId,
      taxMode: 'External',
      inventoryMode: 'ReserveOnOrder',
      custom: {
        type: {
          typeId: 'type',
          key: 'adelco-cart-type'
        },
        fields: {
          createdBy: anonymousId,
          deliveryZone: {
            typeId: 'key-value-document',
            id: deliveryZoneId
          },
          source: ECOMM_SOURCE_CUSTOM_FIELD,
          uniqueSkuCount: cartDraft.lineItems?.length ?? 0
        }
      }
    };

    return await this.cartsRepository.create({
      queryArgs,
      body
    });
  }

  async getActiveCart(userId: string, businessUnitKey?: string, expand?: string[]): Promise<Cart> {
    const where = ['cartState="Active"', `custom(fields(createdBy="${userId}"))`];
    if (businessUnitKey) {
      where.push(`businessUnit(key="${businessUnitKey}")`);
    }
    const { results } = await this.cartsRepository.find({
      queryArgs: { where, limit: 1, expand }
    });

    if (!results.length) {
      throw new NotFoundException('Not active cart for this user.');
    }

    return results[0];
  }

  async getActiveCartById(cartId: string, isAnonymous?: boolean): Promise<Cart> {
    const where = [`id="${cartId}"`, 'cartState="Active"'];

    if (isAnonymous) {
      where.push(`anonymousId is defined`);
    }

    const { results } = await this.cartsRepository.find({
      queryArgs: { where, limit: 1 }
    });

    if (!results.length) {
      throw new BadRequestException(`Not found an ${isAnonymous ? 'anonymous' : ''} active cart.`);
    }

    return results[0];
  }

  async getByBusinessUnitKey(userId: string, businessUnitKey: string): Promise<Cart> {
    const where = [`businessUnit(key="${businessUnitKey}")`, `custom(fields(createdBy="${userId}"))`, 'cartState="Active"'];

    const { results } = await this.cartsRepository.find({
      queryArgs: { where, expand: [...defaultExpand, 'discountCodes[*].discountCode'], limit: 1 }
    });

    if (!results.length) {
      throw new NotFoundException('Not active cart for this user.');
    }

    return results[0];
  }

  async getActiveCartByAnonymousId(anonymousId: string, expand?: string[]): Promise<Cart> {
    const where = ['cartState="Active"', `anonymousId="${anonymousId}"`];
    const { results } = await this.cartsRepository.find({
      queryArgs: { limit: 1, where, expand }
    });

    if (!results.length) {
      throw new NotFoundException('Not active cart for this user.');
    }

    return results[0];
  }

  async updateCart(cartId: string, version: number, actions: CartUpdateAction[], queryArgs?: QueryArgsDto): Promise<Cart> {
    return this.cartsRepository.updateById(cartId, {
      queryArgs,
      body: { version, actions }
    });
  }

  async removeLineItemAndSetCartCustomField(cartId: string, lineItemId: string, version: number, uniqueSkuCount?: number, sku?: string, queryArgs?: QueryArgsDto): Promise<Cart> {
    const actions = [
      {
        action: 'removeLineItem',
        lineItemId
      },
      uniqueSkuCount
        ? {
            action: 'setCustomField',
            name: 'uniqueSkuCount',
            value: uniqueSkuCount - 1
          }
        : undefined
    ].filter(Boolean) as CartUpdateAction[];

    return this.updateCart(cartId, version, actions, queryArgs);
  }

  async updateLineItemQuantity(quantity: number, cartId: string, lineItem: LineItem, version: number, queryArgs?: QueryArgsDto): Promise<Cart> {
    const action = {
      action: 'changeLineItemQuantity',
      lineItemId: lineItem.id,
      quantity,
      externalPrice: {
        currencyCode: lineItem.price.value.currencyCode,
        centAmount: lineItem.price.value.centAmount
      }
    } as CartChangeLineItemQuantityAction;

    return this.updateCart(cartId, version, [action], queryArgs);
  }

  async getAnonymousCart(deliveryZoneId: string, anonymousId: string): Promise<Cart> {
    const cart = await this.getActiveCartByAnonymousId(anonymousId, defaultExpand);
    this.validateDeliveryZone(cart, deliveryZoneId);

    return cart;
  }

  async addLineItems(cartId: string, version: number, lineItemDrafts: LineItemDraft[], lineItemIdsToDelete: string[], queryArgs?: QueryArgsDto): Promise<Cart> {
    const actions = [...this.cartsHelperService.buildLineItemActions(lineItemDrafts, lineItemIdsToDelete), ...this.cartsHelperService.buildCustomFieldActions(lineItemDrafts)];
    return await this.updateCart(cartId, version, actions, queryArgs);
  }

  async removeAnonymousLineItem(lineItemId: string, anonymousId: string): Promise<Cart> {
    const cart = await this.getActiveCartByAnonymousId(anonymousId, defaultExpand);
    const { variant, custom } = this.getLineItem(cart.lineItems, lineItemId);

    return this.removeLineItemAndSetCartCustomField(cart.id, lineItemId, cart.version, custom?.fields?.uniqueSkuCount, variant?.sku, { expand: defaultExpand });
  }

  async updateAnonymousLineItemQuantity(lineItemId: string, quantity: number, anonymousId: string): Promise<Cart> {
    const cart = await this.getActiveCartByAnonymousId(anonymousId, defaultExpand);
    const lineItem = this.getLineItem(cart.lineItems, lineItemId);
    const deliveryZoneKey = cart.custom?.fields?.deliveryZone?.obj?.key;
    if (!deliveryZoneKey) {
      throw new NotFoundException('Cart missing Delivery Zone');
    }

    const { dcCode } = await this.deliveryZoneService.getAndValidateDeliveryZone(deliveryZoneKey);
    const supplyChannels = await this.channelsService.getSupplyChannels();
    this.cartsHelperService.validateStock(lineItem.variant, dcCode, quantity, supplyChannels);

    return this.updateLineItemQuantity(quantity, cart.id, lineItem, cart.version, { expand: defaultExpand });
  }

  getLineItem(lineItems: LineItem[], lineItemId: string): LineItem {
    const lineItem = lineItems.find(lineItem => lineItem.id === lineItemId);
    if (!lineItem) {
      throw new NotFoundException(`Line item not found`);
    }

    return lineItem;
  }

  async addAnonymousLineItems(lineItemDraft: LineItemDraft, deliveryZoneId: string, anonymousId: string): Promise<Cart> {
    let activeCart: Cart;
    let deliveryZone: CustomObject;

    try {
      activeCart = await this.getActiveCartByAnonymousId(anonymousId, defaultExpand);
      deliveryZone = activeCart.custom?.fields?.deliveryZone?.obj;
    } catch (e) {}

    if (!activeCart) {
      deliveryZone = await this.deliveryZoneService.getById(deliveryZoneId);
    } else {
      this.validateDeliveryZone(activeCart, deliveryZoneId);
    }

    const defaultDistributionChannelId = await this.cartsHelperService.getDefaultDistributionChannelForDeliveryZone([deliveryZone]);
    const { dcCode, t2Rate } = (deliveryZone.value as IDeliveryZoneValue) || {};

    const { productsDraft, lineItemsIdsToDelete } = await this.cartsHelperService.getProductsDraftAndLineItemsIdsToDelete({
      lineItemsDraft: [lineItemDraft],
      cart: activeCart,
      distributionChannelId: defaultDistributionChannelId,
      dcCode,
      t2Rate
    });

    if (!activeCart) {
      return this.createAnonymous({ lineItems: productsDraft }, anonymousId, deliveryZoneId, { expand: defaultExpand });
    } else if (productsDraft.length + lineItemsIdsToDelete.length !== 0) {
      return this.addLineItems(activeCart.id, activeCart.version, productsDraft, lineItemsIdsToDelete, { expand: defaultExpand });
    }
  }

  async deleteAnonymousCart(anonymousId: string): Promise<Cart> {
    const cart = await this.getActiveCartByAnonymousId(anonymousId);
    const deletedCart = await this.deleteCart(cart.id, cart.version);
    return deletedCart;
  }

  async deleteCart(cartId: string, version: number): Promise<Cart> {
    const cart = await this.cartsRepository.deleteById(cartId, {
      queryArgs: { version }
    });

    return cart;
  }

  private validateDeliveryZone(cart: Cart, deliveryZoneId: string): void {
    if (cart.custom?.fields?.deliveryZone?.id !== deliveryZoneId) {
      throw new BadRequestException(`Delivery Zone Missmatch`);
    }
  }

  async checkStockAndPriceChanges(cart: Cart, forceUpdate?: boolean): Promise<{ cart: Cart; cartUpdates?: { isQuantityUpdated: boolean; isPriceUpdated: boolean } }> {
    const isUpdateLastVerificationTime = forceUpdate || this.cartsHelperService.checkIfLastVerificationIsOlderMaxConfig(cart);

    if (isUpdateLastVerificationTime) {
      const deliveryZone = cart.custom?.fields?.deliveryZone?.obj;

      const {
        value: { dcCode, t2Rate }
      } = deliveryZone;

      const distributionChannelId = await this.cartsHelperService.getDefaultDistributionChannelForDeliveryZone([deliveryZone]);

      const { isQuantityUpdated, isPriceUpdated, updatedActions } = await this.cartsHelperService.verifyPricesAndStock(cart, dcCode, t2Rate, distributionChannelId);

      const updatedCart = await this.updateCart(cart.id, cart.version, [...updatedActions, ...this.cartsHelperService.buildLastVerificationTimeActions()]);

      return {
        cart: updatedCart,
        cartUpdates: { isQuantityUpdated, isPriceUpdated }
      };
    }

    return {
      cart
    };
  }
}
