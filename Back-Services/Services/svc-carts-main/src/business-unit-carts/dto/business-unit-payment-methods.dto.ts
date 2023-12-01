import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentMethod {
  @ApiProperty({
    description: 'Indicates payment method',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['Cash', 'BankTransfer', 'DayCheck', 'DateCheck', 'Credit'])
  key: string;

  @ApiProperty({
    description: 'Payment method description',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Payment method term in days',
    type: Number,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  termDays: number;

  @ApiProperty({
    description: 'Payment method condition',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  condition: string;
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
