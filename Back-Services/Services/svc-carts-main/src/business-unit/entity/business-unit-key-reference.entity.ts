import { ApiProperty } from '@nestjs/swagger';

export class BusinessUnitKeyReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default business-unit',
    type: String,
    required: true
  })
  typeId: 'business-unit';

  @ApiProperty({
    description: 'Unique and immutable key of the reference',
    type: String,
    required: true
  })
  key: string;
}
