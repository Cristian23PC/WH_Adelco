import { Cart } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class CartReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default cart',
    type: String,
    required: true
  })
  typeId: 'cart';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    required: false
  })
  obj?: Cart;
}
