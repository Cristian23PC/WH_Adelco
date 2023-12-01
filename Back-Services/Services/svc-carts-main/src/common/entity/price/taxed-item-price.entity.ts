import { CentPrecisionMoney, TaxPortion } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { CentPrecisionMoneyEntity } from './cent-precision-money.entity';

export class TaxedItemPriceEntity {
  @ApiProperty({
    description: 'Total net amount of the Line Item or Custom Line Item.',
    type: () => CentPrecisionMoneyEntity,
    required: true
  })
  totalNet: CentPrecisionMoney;

  @ApiProperty({
    description: 'Total gross amount of the Line Item or Custom Line Item.',
    type: () => CentPrecisionMoneyEntity,
    required: true
  })
  totalGross: CentPrecisionMoney;

  @ApiProperty({
    description: 'Total tax applicable for the Line Item or Custom Line Item.',
    type: () => CentPrecisionMoneyEntity,
    required: false
  })
  totalTax?: CentPrecisionMoney;
}

export class TaxedPriceEntity extends TaxedItemPriceEntity {
  @ApiProperty({
    description: 'Taxable portions added to the total net price.',
    type: () => TaxPortionEntity,
    required: false,
    isArray: true
  })
  taxPortions: TaxPortion[];
}

export class TaxPortionEntity {
  @ApiProperty({
    description: 'Name of the tax portion.',
    type: String,
    required: false
  })
  name?: string;

  @ApiProperty({
    description: 'A number in the range 0-1.',
    type: Number,
    required: true
  })
  rate: number;

  @ApiProperty({
    description: 'Money value of the tax portion.',
    type: () => CentPrecisionMoneyEntity,
    required: true
  })
  amount: CentPrecisionMoney;
}
