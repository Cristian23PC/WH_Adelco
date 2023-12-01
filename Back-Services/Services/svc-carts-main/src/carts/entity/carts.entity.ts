import { AddressEntity } from '@/common/entity/address/adddress.entity';
import { CentPrecisionMoneyEntity } from '@/common/entity/price/cent-precision-money.entity';
import { CustomFieldsEntity } from '@/common/entity/custom-fields.entity';
import { DirectDiscountEntity, DiscountCodeInfoEntity } from '@/common/entity/discount/discounted-line-item-price-for-quantity.entity';
import { PaymentInfoEntity } from '@/common/entity/payment/payment-info.entity';
import { ShippingEntity } from '@/common/entity/address/shippin.entity';
import { ShippingInfoEntity } from '@/common/entity/address/shipping-info.entity';
import { TaxedPriceEntity } from '@/common/entity/price/taxed-item-price.entity';
import {
  Address,
  BusinessUnitKeyReference,
  CartDiscountReference,
  CartOrigin,
  CartState,
  CentPrecisionMoney,
  CustomFields,
  DirectDiscount,
  DiscountCodeInfo,
  InventoryMode,
  PaymentInfo,
  RoundingMode,
  Shipping,
  ShippingInfo,
  ShippingMode,
  TaxCalculationMode,
  TaxMode,
  TaxedPrice
} from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { BusinessUnitKeyReferenceEntity } from '@/business-unit/entity/business-unit-key-reference.entity';
import { CartDiscountReferenceEntity } from './cart-discount-reference.entity';

export class CartsEntity {
  @ApiProperty({
    description: 'Unique identifier of the Cart.',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    description: 'Current version of the Cart.',
    type: Number,
    required: true
  })
  version: number;

  @ApiProperty({
    description: 'User-defined unique identifier of the Cart.',
    type: String,
    required: false
  })
  key?: string;

  @ApiProperty({
    description: 'Anonymous session associated with the Cart',
    type: String,
    required: false
  })
  anonymousId?: string;

  @ApiProperty({
    description: 'Reference to a Business Unit the Cart belongs to.',
    type: () => BusinessUnitKeyReferenceEntity,
    required: false
  })
  businessUnit?: BusinessUnitKeyReference;

  @ApiProperty({
    description: 'Sum of all LineItem quantities, excluding CustomLineItems. Only present when the Cart has at least one LineItem.',
    type: Number,
    required: false
  })
  totalLineItemQuantity?: number;

  @ApiProperty({
    description: 'Sum of the totalPric` field of all LineItems and CustomLineItems, and if available, the price field of ShippingInfo.',
    type: () => CentPrecisionMoneyEntity,
    required: true
  })
  totalPrice: CentPrecisionMoney;

  @ApiProperty({
    type: () => TaxedPriceEntity,
    required: false
  })
  taxedPrice?: TaxedPrice;

  @ApiProperty({
    description: 'Indicates how Tax Rates are set.',
    type: String,
    required: true
  })
  taxMode: TaxMode;

  @ApiProperty({
    description: 'Indicates how monetary values are rounded when calculating taxes for `taxedPrice`.',
    type: String,
    required: true
  })
  taxRoundingMode: RoundingMode;

  @ApiProperty({
    description: 'Indicates how taxes are calculated when calculating taxes for `taxedPrice`.',
    type: String,
    required: true
  })
  taxCalculationMode: TaxCalculationMode;

  @ApiProperty({
    description: 'Indicates how stock quantities are tracked for Line Items in the Cart.',
    type: String,
    required: true
  })
  inventoryMode: InventoryMode;

  @ApiProperty({
    description: 'Current status of the Cart.',
    type: String,
    required: true
  })
  cartState: CartState;

  @ApiProperty({
    description: 'Billing address associated with the Cart.',
    type: () => AddressEntity,
    required: false
  })
  billingAddress?: Address;

  @ApiProperty({
    description: 'Shipping address associated with the Cart. Determines eligible ShippingMethod rates and Tax Rates of Line Items.',
    type: () => AddressEntity,
    required: false
  })
  shippingAddress?: Address;

  @ApiProperty({
    description: 'Indicates whether the Cart has one or multiple Shipping Methods.',
    type: String,
    required: true
  })
  shippingMode: ShippingMode;

  @ApiProperty({
    description: 'Shipping-related information of a Cart with `Single`.',
    type: () => ShippingInfoEntity,
    required: false
  })
  shippingInfo?: ShippingInfo;

  @ApiProperty({
    description: 'Shipping-related information of a Cart with `Multiple`.',
    type: () => ShippingEntity,
    required: true
  })
  shipping: Shipping[];

  @ApiProperty({
    description: 'Discount Codes applied to the Cart. A Cart that has `directDiscounts` cannot have `discountCodes`.',
    type: () => DiscountCodeInfoEntity,
    required: true,
    isArray: true
  })
  discountCodes: DiscountCodeInfo[];

  @ApiProperty({
    description: 'Direct Discounts added to the Cart. A Cart that has `discountCodes` cannot have `directDiscounts`.',
    type: () => DirectDiscountEntity,
    required: true,
    isArray: true
  })
  directDiscounts: DirectDiscount[];

  @ApiProperty({
    description: 'Automatically set when a Line Item with `GiftLineItem`.',
    type: () => CartDiscountReferenceEntity,
    required: true,
    isArray: true
  })
  refusedGifts: CartDiscountReference[];

  @ApiProperty({
    description: 'Payment information related to the Cart.',
    type: () => PaymentInfoEntity,
    required: false
  })
  paymentInfo?: PaymentInfo;

  @ApiProperty({
    description: 'Used for LineItem Price selection.',
    type: String,
    required: false
  })
  country?: string;

  @ApiProperty({
    description: 'Languages of the Cart.',
    type: String,
    required: false
  })
  locale?: string;

  @ApiProperty({
    description: 'Indicates how the Cart was created.',
    type: String,
    required: true
  })
  origin: CartOrigin;

  @ApiProperty({
    description: 'Custom Fields of the Cart.',
    type: CustomFieldsEntity,
    required: false
  })
  custom?: CustomFields;

  @ApiProperty({
    description: 'Number of days after which an active Cart is deleted since its last modification.',
    type: String,
    required: false
  })
  deleteDaysAfterLastModification?: number;

  @ApiProperty({
    description: 'Date and time (UTC) the Cart was initially created.',
    type: String,
    required: false
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date and time (UTC) the Cart was last updated.',
    type: String,
    required: false
  })
  lastModifiedAt: string;
}
