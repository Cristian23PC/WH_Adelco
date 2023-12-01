import { StateReference } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { StateReferenceEntity } from '../state/state-reference.entity';

export class ItemStateEntity {
  @ApiProperty({
    type: Number,
    required: true
  })
  quantity: number;

  @ApiProperty({
    type: () => StateReferenceEntity,
    required: true
  })
  state?: StateReference;
}
