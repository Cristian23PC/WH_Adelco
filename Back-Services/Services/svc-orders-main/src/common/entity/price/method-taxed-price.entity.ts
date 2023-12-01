import { TaxedItemPrice } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { TaxedItemPriceEntity } from './taxed-item-price.entity';

export class MethodTaxedPriceEntity {
  @ApiProperty({
    description: 'User-defined unique identifier of the Shipping Method in a Cart with `Multiple` [ShippingMode](ctp:api:type:ShippingMode).',
    type: String,
    required: true
  })
  shippingMethodKey: string;

  @ApiProperty({
    description: 'Taxed price for the Shipping Method.',
    type: () => TaxedItemPriceEntity,
    required: true
  })
  taxedPrice?: TaxedItemPrice;
}
