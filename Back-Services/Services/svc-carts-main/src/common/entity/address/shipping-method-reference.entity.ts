import { ApiProperty } from '@nestjs/swagger';

export class ShippingMethodReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default shipping-method',
    type: String,
    required: true
  })
  typeId: 'shipping-method';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;
}
