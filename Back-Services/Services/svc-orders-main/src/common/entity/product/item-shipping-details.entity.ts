import { ItemShippingTarget } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class ItemShippingDetailsEntity {
  @ApiProperty({
    description: 'Holds information on the quantity of Line Items or Custom Line Items and the address it is shipped.',
    type: () => ItemShippingTargetEntity,
    isArray: true,
    required: true
  })
  targets: ItemShippingTarget[];

  @ApiProperty({
    type: Boolean,
    required: true
  })
  valid: boolean;
}

export class ItemShippingTargetEntity {
  @ApiProperty({
    description: 'Key of the address in the `itemShippingAddresses`.',
    type: String,
    required: true
  })
  addressKey: string;

  @ApiProperty({
    description: 'Quantity of Line Items or Custom Line Items shipped to the address with the specified `addressKey`.',
    type: Number,
    required: true
  })
  quantity: number;

  @ApiProperty({
    description: 'User-defined unique identifier of the Shipping Method in a Cart with `Multiple`.',
    type: String,
    required: false
  })
  shippingMethodKey?: string;
}
