import { ApiProperty } from '@nestjs/swagger';
import { CentPrecisionMoneyEntity } from '../price/cent-precision-money.entity';
import {
  CentPrecisionMoney,
  Delivery,
  DiscountedLineItemPrice,
  ShippingMethodReference,
  ShippingMethodState,
  ShippingRate,
  TaxCategoryReference,
  TaxRate,
  TaxedItemPrice,
  TypedMoney
} from '@commercetools/platform-sdk';
import { TaxedItemPriceEntity } from '../price/taxed-item-price.entity';
import { TaxRateEntity } from '../price/tax-rate.entity';
import { TaxCategoryReferenceEntity } from '../price/tax-category-reference.entity';
import { DiscountedLineItemPriceEntity } from '../discount/discounted-line-item-price-for-quantity.entity';
import { ShippingMethodReferenceEntity } from './shipping-method-reference.entity';
import { TypedMoneyEntity } from '../price/typed-money.entity';
import { DeliveryEntity } from '../delivery.entity';

export class ShippingInfoEntity {
  @ApiProperty({
    description: 'Name of the Shipping Method.',
    type: String,
    required: true
  })
  shippingMethodName: string;

  @ApiProperty({
    description: 'Determined based on the ShippingRate.',
    type: () => CentPrecisionMoneyEntity,
    required: true
  })
  price: CentPrecisionMoney;

  @ApiProperty({
    description: 'Used to determine the price.',
    type: () => ShippingRateEntity,
    required: true
  })
  shippingRate: ShippingRate;

  @ApiProperty({
    description: 'Automatically set after the `taxRate` is set.',
    type: () => TaxedItemPriceEntity,
    required: false
  })
  taxedPrice?: TaxedItemPrice;

  @ApiProperty({
    description: 'Tax Rate for the Shipping Method.',
    type: () => TaxRateEntity,
    required: false
  })
  taxRate?: TaxRate;

  @ApiProperty({
    description: 'Used to select a Tax Rate when a Cart has the `Platform`.',
    type: () => TaxCategoryReferenceEntity,
    required: false
  })
  taxCategory?: TaxCategoryReference;

  @ApiProperty({
    description: 'Not set if a custom Shipping Method is used.',
    type: () => ShippingMethodReferenceEntity,
    required: false
  })
  shippingMethod?: ShippingMethodReference;

  @ApiProperty({
    description: 'Information on how items are delivered to customers.',
    type: () => DeliveryEntity,
    required: false,
    isArray: true
  })
  deliveries?: Delivery[];

  @ApiProperty({
    description: 'Discounted price of the Shipping Method.',
    type: () => DiscountedLineItemPriceEntity,
    required: false
  })
  discountedPrice?: DiscountedLineItemPrice;

  @ApiProperty({
    description: 'Discounted price of the Shipping Method.',
    type: String,
    required: false
  })
  shippingMethodState: ShippingMethodState;
}

export class ShippingRateEntity {
  @ApiProperty({
    description: 'Currency amount of the ShippingRate.',
    type: () => TypedMoneyEntity,
    required: false
  })
  price: TypedMoney;

  @ApiProperty({
    description: 'Shipping is free if the sum of the (Custom) Line Item Prices reaches the specified value.',
    type: () => TypedMoneyEntity,
    required: false
  })
  freeAbove?: TypedMoney;

  @ApiProperty({
    type: Boolean,
    required: false
  })
  isMatching?: boolean;
}
