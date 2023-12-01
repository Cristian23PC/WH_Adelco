import { BusinessUnitKeyReferenceEntity } from '@/business-unit/entity/business-unit-key-reference.entity';
import { CartDiscountReferenceEntity } from '@/carts/entity/cart-discount-reference.entity';
import { CartReferenceEntity } from '@/carts/entity/cart-reference.entity';
import { AddressEntity } from '@/common/entity/address/adddress.entity';
import { ShippingEntity } from '@/common/entity/address/shipping.entity';
import { ShippingInfoEntity } from '@/common/entity/address/shipping-info.entity';
import { CustomFieldsEntity } from '@/common/entity/custom-fields.entity';
import { CustomerGroupReferenceEntity } from '@/common/entity/customer-group-reference.entity';
import { DiscountCodeInfoEntity } from '@/common/entity/discount/discounted-line-item-price-for-quantity.entity';
import { PaymentInfoEntity } from '@/common/entity/payment/payment-info.entity';
import { CentPrecisionMoneyEntity } from '@/common/entity/price/cent-precision-money.entity';
import { TaxedPriceEntity } from '@/common/entity/price/taxed-item-price.entity';
import { CustomLineItemEntity } from '@/common/entity/product/line-item.entity';
import { QuoteReferenceEntity } from '@/common/entity/quote-reference.entity';
import { StoreKeyReferenceEntity } from '@/common/entity/store-key-reference.entity';
import { SyncInfoEntity } from '@/common/entity/sync-info.entity';
import {
  Address,
  BusinessUnitKeyReference,
  CartDiscountReference,
  CartOrigin,
  CartReference,
  CentPrecisionMoney,
  CustomFields,
  CustomLineItem,
  CustomerGroupReference,
  DiscountCodeInfo,
  InventoryMode,
  OrderState,
  PaymentInfo,
  PaymentState,
  QuoteReference,
  RoundingMode,
  ShipmentState,
  Shipping,
  ShippingInfo,
  ShippingMode,
  StoreKeyReference,
  SyncInfo,
  TaxCalculationMode,
  TaxMode,
  TaxedPrice
} from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class OrdersEntity {
  @ApiProperty({
    description: 'Unique identifier of the Order.',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    description: 'Current version of the order.',
    type: Number,
    required: true
  })
  version: number;

  @ApiProperty({
    description: 'Date and time (UTC) the Order was initially created.',
    type: String,
    required: true
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date and time (UTC) the Order was last updated.',
    type: String,
    required: true
  })
  lastModifiedAt: string;

  @ApiProperty({
    type: String,
    required: false
  })
  lastModifiedBy?: string;

  @ApiProperty({
    type: String,
    required: false
  })
  createdBy?: string;

  @ApiProperty({
    description: 'This field will only be present if it was set for Order Import.',
    type: String,
    required: false
  })
  completedAt?: string;

  @ApiProperty({
    description: 'String that uniquely identifies an order.',
    type: String,
    required: false
  })
  orderNumber?: string;

  @ApiProperty({
    type: String,
    required: false
  })
  customerId?: string;

  @ApiProperty({
    type: String,
    required: false
  })
  customerEmail?: string;

  @ApiProperty({
    description: 'Identifies carts and orders belonging to an anonymous session.',
    type: String,
    required: false
  })
  anonymousId?: string;

  @ApiProperty({
    description: 'Reference to a Business Unit the Order belongs to.',
    type: () => BusinessUnitKeyReferenceEntity,
    required: false
  })
  businessUnit?: BusinessUnitKeyReference;

  @ApiProperty({
    type: () => StoreKeyReferenceEntity,
    required: false
  })
  store?: StoreKeyReference;

  @ApiProperty({
    type: () => CustomLineItemEntity,
    required: true,
    isArray: true
  })
  customLineItems: CustomLineItem;

  @ApiProperty({
    description: 'Sum of the totalPrice field of all LineItems and CustomLineItems, and if available, the price field of ShippingInfo.',
    type: () => CentPrecisionMoneyEntity,
    required: true
  })
  totalPrice: CentPrecisionMoney;

  @ApiProperty({
    description: 'The taxes are calculated based on the shipping address.',
    type: () => TaxedPriceEntity,
    required: false
  })
  taxedPrice?: TaxedPrice;

  @ApiProperty({
    description: 'Sum of `taxedPrice` of across all Shipping Methods.',
    type: () => TaxedPriceEntity,
    required: false
  })
  taxedShippingPrice?: TaxedPrice;

  @ApiProperty({
    description: 'Shipping address associated with the Order. Determines eligible ShippingMethod rates and Tax Rates of Line Items.',
    type: () => AddressEntity,
    required: false
  })
  shippingAddress?: Address;

  @ApiProperty({
    description: 'Billing address associated with the Order.',
    type: () => AddressEntity,
    required: false
  })
  billingAddress?: Address;

  @ApiProperty({
    description: 'Indicates whether one or multiple Shipping Methods are added to the Cart.',
    type: String,
    required: true
  })
  shippingMode: ShippingMode;

  @ApiProperty({
    description: 'User-defined unique identifier of the Shipping Method with `Single`.',
    type: String,
    required: false
  })
  shippingKey?: string;

  @ApiProperty({
    description: 'Custom Fields of the Shipping Method for `Single`.',
    type: () => CustomFieldsEntity,
    required: false
  })
  shippingCustomFields?: CustomFields;

  @ApiProperty({
    description: 'Shipping-related information of a Order with `Multiple`.',
    type: () => ShippingEntity,
    required: true
  })
  shipping: Shipping[];

  @ApiProperty({
    description: 'Indicates how Tax Rates are set.',
    type: String,
    required: false
  })
  taxMode?: TaxMode;

  @ApiProperty({
    description: 'When calculating taxes for `taxedPrice`, the selected mode is used for rouding.',
    type: String,
    required: false
  })
  taxRoundingMode?: RoundingMode;

  @ApiProperty({
    description: 'Set when the customer is set and the customer is a member of a customer group.',
    type: () => CustomerGroupReferenceEntity,
    required: false
  })
  customerGroup?: CustomerGroupReference;

  @ApiProperty({
    description: 'A two-digit country code as per [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2).',
    type: String,
    required: false
  })
  country?: string;

  @ApiProperty({
    description: 'One of the four predefined OrderStates.',
    type: String,
    required: true
  })
  orderState: OrderState;

  @ApiProperty({
    type: String,
    required: false
  })
  shipmentState?: ShipmentState;

  @ApiProperty({
    type: String,
    required: false
  })
  paymentState?: PaymentState;

  @ApiProperty({
    description: 'Shipping-related information of a Order with `Single`.',
    type: () => ShippingInfoEntity,
    required: false
  })
  shippingInfo?: ShippingInfo;

  @ApiProperty({
    type: () => SyncInfoEntity,
    isArray: true,
    required: true
  })
  syncInfo: SyncInfo[];

  @ApiProperty({
    description: 'The Purchase Order Number is typically set by the on a to track the purchase order during the quote and order flow.',
    type: String,
    required: false
  })
  purchaseOrderNumber?: string;

  @ApiProperty({
    description: 'The Purchase Order Number is typically set by the on a to track the purchase order during the quote and order flow.',
    type: () => DiscountCodeInfoEntity,
    isArray: true,
    required: false
  })
  discountCodes?: DiscountCodeInfo[];

  @ApiProperty({
    description: 'Set when this order was created from a cart.',
    type: () => CartReferenceEntity,
    required: false
  })
  cart?: CartReference;

  @ApiProperty({
    description: 'Set when this order was created from a quote.',
    type: () => QuoteReferenceEntity,
    required: false
  })
  quote?: QuoteReference;

  @ApiProperty({
    description: 'Custom Fields of the Orders.',
    type: CustomFieldsEntity,
    required: false
  })
  custom?: CustomFields;

  @ApiProperty({
    description: 'Payment information related to the Orders.',
    type: () => PaymentInfoEntity,
    required: false
  })
  paymentInfo?: PaymentInfo;

  @ApiProperty({
    description: 'Languages of the Order.',
    type: String,
    required: false
  })
  locale?: string;

  @ApiProperty({
    type: String,
    required: false
  })
  inventoryMode?: InventoryMode;

  @ApiProperty({
    description: 'Indicates how the Cart was created.',
    type: String,
    required: true
  })
  origin: CartOrigin;

  @ApiProperty({
    description:
      'When calculating taxes for `taxedPrice`, the selected mode is used for calculating the price with LineItemLevel (horizontally) or UnitPriceLevel (vertically) calculation mode.',
    type: String,
    required: false
  })
  taxCalculationMode?: TaxCalculationMode;

  @ApiProperty({
    description: 'Contains addresses for orders with multiple shipping addresses.',
    type: () => AddressEntity,
    isArray: true,
    required: false
  })
  itemShippingAddresses?: Address[];

  @ApiProperty({
    description: 'Automatically filled when a line item with LineItemMode `GiftLineItem` is removed from this order.',
    type: () => CartDiscountReferenceEntity,
    isArray: true,
    required: true
  })
  refusedGifts: CartDiscountReference[];
}
