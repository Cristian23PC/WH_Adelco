import { ApiProperty } from '@nestjs/swagger';

export class TypedMoneyEntity {
  @ApiProperty({
    description: 'Indicate type ID default business-unit',
    type: String,
    required: true
  })
  typeId: 'business-unit';

  @ApiProperty({
    description: 'Unique and immutable key of the reference',
    type: String,
    required: true
  })
  key: string;

  @ApiProperty({
    description: 'Indicate type default centPrecision',
    type: String,
    required: true
  })
  type: 'centPrecision';

  @ApiProperty({
    description: 'Amount in the smallest indivisible unit of a currency',
    type: Number,
    required: true
  })
  centAmount: number;

  @ApiProperty({
    description: 'Currency code compliant to [ISO 4217](https://en.wikipedia.org/wiki/ISO_4217).',
    type: String,
    required: true
  })
  currencyCode: string;

  @ApiProperty({
    description: 'The number of default fraction digits for the given currency, like `2` for EUR or `0` for JPY.',
    type: Number,
    required: true
  })
  fractionDigits: number;
}
