import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PaymentMethod {
  @ApiProperty({
    description: 'Indicates payment method',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['cash', 'bank-transfer'])
  key: string;
}

export class PaymentMethodsResponseDto {
  @ApiProperty({
    description: 'List of payment methods',
    type: () => PaymentMethod,
    isArray: true,
    required: true
  })
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethod)
  paymentMethods: PaymentMethod[];
}
