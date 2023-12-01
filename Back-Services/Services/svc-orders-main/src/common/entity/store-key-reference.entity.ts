import { ApiProperty } from '@nestjs/swagger';

export class StoreKeyReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default store',
    type: String,
    required: true
  })
  typeId: 'store';

  @ApiProperty({
    description: 'Unique and immutable key of the reference',
    type: String,
    required: true
  })
  key: string;
}
