import { DescribedMoney } from '@adelco/price-calc';
import { ApiProperty } from '@nestjs/swagger';
import { DescribedMoneyEntity } from './described-money.entity';

export class TotalDetailsEntity {
  @ApiProperty({
    description: 'Sub total price.',
    type: Number,
    required: true
  })
  subtotalPrice: number;

  @ApiProperty({
    description: 'Sub total price.',
    type: () => DescribedMoneyEntity,
    required: true,
    isArray: true
  })
  discounts: DescribedMoney[];

  @ApiProperty({
    description: 'Net price.',
    type: Number,
    required: true
  })
  netPrice: number;

  @ApiProperty({
    description: 'Taxes.',
    type: () => DescribedMoneyEntity,
    required: true,
    isArray: true
  })
  taxes: DescribedMoney[];

  @ApiProperty({
    description: 'Gross price.',
    type: Number,
    required: true
  })
  grossPrice: number;
}
