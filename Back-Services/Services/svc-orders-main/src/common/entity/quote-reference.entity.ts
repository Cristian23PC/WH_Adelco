import { Quote } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';

export class QuoteReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default quote',
    type: String,
    required: true
  })
  typeId: 'quote';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;

  @ApiProperty({
    required: false
  })
  obj?: Quote;
}
