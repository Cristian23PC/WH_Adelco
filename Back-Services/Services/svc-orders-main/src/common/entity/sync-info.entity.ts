import { ChannelReference } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelReferenceEntity } from './channel/channel-reference.entity';

export class SyncInfoEntity {
  @ApiProperty({
    description: 'Connection to a particular synchronization destination.',
    type: () => ChannelReferenceEntity,
    required: false
  })
  channel: ChannelReference;

  @ApiProperty({
    description: 'Can be used to reference an external order instance, file etc.',
    type: String,
    required: false
  })
  externalId?: string;

  @ApiProperty({
    type: String,
    required: true
  })
  syncedAt: string;
}
