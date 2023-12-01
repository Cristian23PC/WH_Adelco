import { ApiProperty } from '@nestjs/swagger';

export class PriceDto {
  @ApiProperty({ description: 'Unique identifier of this Price.' })
  id: string;

  @ApiProperty({ description: 'User-defined identifier of the Price. It is unique per ProductVariant.', required: false })
  key: string;

  @ApiProperty({ description: 'Money value of this Price.' })
  value: any;

  @ApiProperty({ description: 'Country for which this Price is valid.', required: false })
  country: any;

  @ApiProperty({ description: 'CustomerGroup for which this Price is valid.', required: false })
  customerGroup: any;

  @ApiProperty({ description: 'ProductDistribution Channel for which this Price is valid.', required: false })
  channel: number;

  @ApiProperty({ description: 'Date and time from which this Price is valid.', required: false })
  validFrom: Date;

  @ApiProperty({ description: 'Date and time until this Price is valid.', required: false })
  validUntil: Date;

  @ApiProperty({ description: 'Is set if a ProductDiscount has been applied', required: false })
  discounted: any;

  @ApiProperty({ description: 'Present if different Prices for certain LineItem quantities have been specified', required: false, isArray: true })
  tiers: any[];

  @ApiProperty({ description: 'Custom Fields defined for the Price.', required: false })
  custom: any;
}
