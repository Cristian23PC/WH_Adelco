import { ApiProperty } from '@nestjs/swagger';

export class CartDiscountReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default cart-discount',
    type: String,
    required: true
  })
  typeId: 'cart-discount';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;
}
