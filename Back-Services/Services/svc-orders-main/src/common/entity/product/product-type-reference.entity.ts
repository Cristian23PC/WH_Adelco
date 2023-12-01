import { ApiProperty } from '@nestjs/swagger';

export class ProductTypeReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default product-type',
    type: String,
    required: true
  })
  typeId: 'product-type';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;
}
