import { PAYMENT_METHOD } from '@/payments/enum/payment.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsEnum, IsISO8601, IsNotEmpty, IsString, Length, ValidateIf, ValidateNested } from 'class-validator';
import { CommonPaymentsDtoRequest } from './common-payment.dto';

export class Payment {
  @ApiProperty({ description: 'Payment method', enum: PAYMENT_METHOD, example: PAYMENT_METHOD.CASH, isArray: false, required: true })
  @IsEnum(PAYMENT_METHOD)
  @IsNotEmpty()
  method: PAYMENT_METHOD;

  @ApiProperty({ description: 'Transfer number' })
  @ValidateIf(o => o.method === PAYMENT_METHOD.BANK_TRANSFER)
  @IsNotEmpty()
  transferNumber: string;

  @ApiProperty({ description: 'Check number' })
  @ValidateIf(o => [PAYMENT_METHOD.DAY_CHECK, PAYMENT_METHOD.DATE_CHECK].includes(o.method))
  @IsNotEmpty()
  checkNumber: string;

  @ApiProperty({ description: 'Card transaction number' })
  @ValidateIf(o => o.method === PAYMENT_METHOD.DEBIT_CARD || o.method === PAYMENT_METHOD.CREDIT_CARD)
  @IsNotEmpty()
  trxNumber: string;

  @ApiProperty({ description: 'Transfer bank code' })
  @ValidateIf(o => o.method === PAYMENT_METHOD.BANK_TRANSFER)
  @IsNotEmpty()
  bankCode: string;

  @ApiProperty({ description: 'Transfer account number' })
  @ValidateIf(o => o.method === PAYMENT_METHOD.BANK_TRANSFER)
  @IsNotEmpty()
  accountNumber: string;

  @ApiProperty({ description: 'Date of the expiration' })
  @ValidateIf(o => o.method === PAYMENT_METHOD.DATE_CHECK)
  @IsISO8601({ strict: true })
  @Length(10, 10)
  checkExpirationDate: string;

  @ApiProperty({ required: true, description: 'Amount paid for the delivery' })
  @IsNotEmpty()
  amountPaid: number;
}

export class CollectPaymentsDtoRequest extends CommonPaymentsDtoRequest {
  @ApiProperty({ required: true, description: 'Sales rep RUT' })
  @IsNotEmpty()
  @IsString()
  salesRepRUT: string;

  @ApiProperty({ required: true, description: 'Delivery documents IDs', isArray: true })
  @ArrayMinSize(1)
  @IsArray()
  @IsString({ each: true })
  invoices: string[];

  @ApiProperty({ required: true, description: 'Credit notes documents IDs', isArray: true })
  @ArrayMinSize(0) // TODO: Should change this when implement credit notes
  @IsArray()
  //@IsString({ each: true }) // TODO: Should change this when implement credit notes
  creditNotes: string[];

  @ApiProperty({ required: true, description: 'Commercetools payment id' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Payment)
  payments: Payment[];
}
