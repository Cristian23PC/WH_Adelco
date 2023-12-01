import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Min } from 'class-validator';

export class LineItemDraftDto {
  @ApiProperty({
    description: 'Product SKU',
    type: 'string',
    required: true
  })
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'Quantity',
    type: 'number',
    minimum: 1,
    default: 1
  })
  @Min(1)
  quantity = 1;
}
