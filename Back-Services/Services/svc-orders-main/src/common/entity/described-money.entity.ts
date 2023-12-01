import { ApiProperty } from '@nestjs/swagger';

export class DescribedMoneyEntity {
  @ApiProperty({
    description: 'Description.',
    type: String,
    required: true
  })
  description: string;

  @ApiProperty({
    description: 'Value.',
    type: Number,
    required: true
  })
  amount: number;
}
