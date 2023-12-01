import { ShippingInfo } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { ShippingInfoEntity } from './shipping-info.entity';
import { AddressEntity } from './adddress.entity';
import { Address } from 'cluster';

export class ShippingEntity {
  @ApiProperty({
    description: 'User-defined unique identifier of the Shipping in a Cart with `Multiple` [ShippingMode](ctp:api:type:ShippingMode).',
    type: String,
    required: true
  })
  shippingKey: string;

  @ApiProperty({
    description: 'Automatically set when the Shipping Method is added.',
    type: () => ShippingInfoEntity,
    required: true
  })
  shippingInfo: ShippingInfo;

  @ApiProperty({
    description: 'Determines the shipping rates and Tax Rates of associated Line Items.',
    type: () => AddressEntity,
    required: true
  })
  shippingAddress: Address;
}
