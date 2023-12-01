import { ApiProperty } from '@nestjs/swagger';

export class StateReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default state',
    type: String,
    required: true
  })
  typeId: 'state';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;
}
