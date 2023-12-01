import { ApiProperty } from '@nestjs/swagger';

export class PaymentReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default payment',
    type: String,
    required: true
  })
  typeId: 'payment';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;
}
