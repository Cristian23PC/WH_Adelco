import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ORDER_SOURCE } from '../enum/business-unit-orders.enum';
import { PAYMENT_METHOD } from '@/payments/enum/payment.enum';
import { Transform } from 'class-transformer';

export class ConvertActiveCartRequestDto {
  @ApiProperty({
    description: 'Payment method',
    enum: PAYMENT_METHOD,
    example: PAYMENT_METHOD.CASH,
    isArray: false,
    required: true
  })
  @IsNotEmpty()
  @IsEnum(PAYMENT_METHOD)
  paymentMethod: PAYMENT_METHOD;

  @ApiProperty({
    description: 'From where is created the order',
    enum: ORDER_SOURCE,
    example: ORDER_SOURCE.ECOMMERCE,
    isArray: false,
    required: true
  })
  @IsNotEmpty()
  @IsEnum(ORDER_SOURCE)
  source: ORDER_SOURCE;

  @ApiProperty({ required: false, description: 'Comment of the customer' })
  @IsOptional()
  @IsString()
  customerComment?: string;

  @ApiProperty({ required: false, description: 'Purchase number' })
  @IsOptional()
  @IsString()
  purchaseNumber?: string;

  @ApiProperty({ required: false, description: 'Cart ID' })
  @IsOptional()
  @IsString()
  cartId?: string;
}

export class VerificationCartRequestArgsDto {
  @ApiProperty({ description: 'Force full verification of prices and stock', type: 'boolean', required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  forceUpdate?: boolean;
}
