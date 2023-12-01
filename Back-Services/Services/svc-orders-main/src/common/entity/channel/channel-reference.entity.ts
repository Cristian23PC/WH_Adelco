import { ApiProperty } from '@nestjs/swagger';

export class ChannelReferenceEntity {
  @ApiProperty({
    description: 'Indicate type ID default channel',
    type: String,
    required: true
  })
  typeId: 'channel';

  @ApiProperty({
    description: 'Unique identifier of the reference',
    type: String,
    required: true
  })
  id: string;
}
