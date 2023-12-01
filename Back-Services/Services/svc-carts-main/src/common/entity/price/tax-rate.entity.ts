import { SubRate } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class TaxRateEntity {
  @ApiProperty({
    description: 'Present if the TaxRate is part of a [TaxCategory].',
    type: String,
    required: false
  })
  id?: string;

  @ApiProperty({
    description: 'Name of the TaxRate.',
    type: String,
    required: true
  })
  name: string;

  @ApiProperty({
    description: 'Tax rate. If subrates are used, the amount must be the sum of all subrates.',
    type: Number,
    required: true
  })
  amount: number;

  @ApiProperty({
    description: 'If `true`, tax is included.',
    type: Boolean,
    required: true
  })
  includedInPrice: boolean;

  @ApiProperty({
    description: 'Country in which the tax rate is applied in [ISO 3166-1 alpha-2](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) format.',
    type: String,
    required: true
  })
  country: string;

  @ApiProperty({
    description: 'State within the country, such as Texas in the United States.',
    type: String,
    required: false
  })
  state?: string;
  /**
   *	Used to calculate the [taxPortions](/../api/projects/carts#taxedprice) field in a Cart or Order. It is useful if the total tax of a country (such as the US) is a combination of multiple taxes (such as state and local taxes).
   *
   *
   */
  @ApiProperty({
    description: 'Used to calculate the taxPortions field in a Cart or Order.',
    type: () => SubRateEntity,
    required: false
  })
  subRates?: SubRate[];
}

export class SubRateEntity {
  @ApiProperty({
    description: 'Name of the SubRate.',
    type: String,
    required: true
  })
  name?: string;

  @ApiProperty({
    type: Number,
    required: true
  })
  amount: number;
}
