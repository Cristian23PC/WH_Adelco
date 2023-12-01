import { CustomerGroup } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class CustomerGroupReferenceEntity {
  @ApiProperty({
    type: String,
    required: true
  })
  typeId: 'customer-group';

  @ApiProperty({
    description: 'Unique identifier of the referenced.',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    required: false
  })
  obj?: CustomerGroup;
}
