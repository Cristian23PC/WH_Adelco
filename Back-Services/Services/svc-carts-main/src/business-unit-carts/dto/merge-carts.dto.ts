import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class MergeCartsDto {
  @ApiProperty({
    description: 'Anonymous cart id'
  })
  @IsString()
  @IsNotEmpty()
  cartId: string;
}
