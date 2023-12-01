import { PAYMENT_CONDITION, PAYMENT_STATUS } from '@/payments/enum/payment.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Payment } from './collect-payments.dto';

export class UpdatePaymentDtoRequest extends Payment {
  @ApiProperty({ required: true, description: 'Business Unit Id' })
  @IsNotEmpty()
  @IsString()
  businessUnitId: string;

  @ApiProperty({ required: true, description: 'Delivery commercetools Id' })
  @IsNotEmpty()
  @IsString()
  deliveryId: string;

  @ApiProperty({ required: true, description: 'Delivery SAP document Id' })
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @ApiProperty({ required: true, description: 'Commercetools payment id' })
  @IsNotEmpty()
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Status of payment', enum: PAYMENT_STATUS, example: PAYMENT_STATUS.PAID, isArray: false, required: true })
  @IsEnum(PAYMENT_STATUS)
  @IsNotEmpty()
  status: PAYMENT_STATUS;

  @ApiProperty({ description: 'Payment condition', enum: PAYMENT_CONDITION, example: PAYMENT_CONDITION.CASH, isArray: false, required: true })
  @IsEnum(PAYMENT_CONDITION)
  @IsNotEmpty()
  condition: PAYMENT_CONDITION;

  @ApiProperty({ description: 'Extra info that needs to be collected by the user', required: false })
  @IsOptional()
  extraInfo: string;
}
