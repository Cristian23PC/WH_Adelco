import { ApiProperty } from '@nestjs/swagger';

export class TaxCategoryReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default tax-category',
    type: String,
    required: true
  })
  typeId: 'tax-category';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;
}
