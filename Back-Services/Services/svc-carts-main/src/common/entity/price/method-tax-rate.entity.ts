import { TaxRate } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { TaxRateEntity } from './tax-rate.entity';

export class MethodTaxRateEntity {
  @ApiProperty({
    description: 'User-defined unique identifier of the Shipping Method in a Cart with `Multiple`.',
    type: String,
    required: true
  })
  shippingMethodKey: string;

  @ApiProperty({
    description: 'Tax Rate for the Shipping Method.',
    type: () => TaxRateEntity,
    required: false
  })
  taxRate?: TaxRate;
}
