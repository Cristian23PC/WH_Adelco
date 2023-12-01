import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddDiscountCodeDto {
  @ApiProperty({
    description: 'Discount code to add'
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
