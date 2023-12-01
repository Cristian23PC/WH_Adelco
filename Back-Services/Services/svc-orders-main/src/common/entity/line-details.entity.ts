import { DescribedMoney } from '@adelco/price-calc';
import { ApiProperty } from '@nestjs/swagger';
import { DescribedMoneyEntity } from './described-money.entity';

export class LineDetailsEntity {
  @ApiProperty({
    description: 'Sub total line item price.',
    type: Number,
    required: true
  })
  lineSubtotalPrice: number;

  @ApiProperty({
    description: 'Discounts.',
    type: () => DescribedMoneyEntity,
    required: true,
    isArray: true
  })
  discounts: DescribedMoney[];

  @ApiProperty({
    description: 'Net price of line item.',
    type: Number,
    required: true
  })
  lineNetPrice: number;

  @ApiProperty({
    description: 'Taxes.',
    type: () => DescribedMoneyEntity,
    required: true,
    isArray: true
  })
  taxes: DescribedMoney[];

  @ApiProperty({
    description: 'Gross price of line item.',
    type: Number,
    required: true
  })
  lineGrossPrice: number;

  @ApiProperty({
    description: 'Unit price of line item.',
    type: Number,
    required: true
  })
  unitPrice: number;

  @ApiProperty({
    description: 'DiscountRate.',
    type: Number,
    required: true
  })
  discountRate: number;
}
