import { ApiProperty } from '@nestjs/swagger';

export class DiscountCodeReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default discount-code',
    type: String,
    required: true
  })
  typeId: 'discount-code';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;
}
