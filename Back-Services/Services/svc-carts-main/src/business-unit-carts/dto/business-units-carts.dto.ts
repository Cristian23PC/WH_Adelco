import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLineItemQuantityRequestDto {
  @ApiProperty({
    description: 'Indicate quantity to update for a line item',
    type: Number,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

class LineItemsSyncCart {
  @ApiProperty({ required: true, description: 'SKU' })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @ApiProperty({ required: true, description: 'Quantity of item' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class UpdateSyncCartRequestDto {
  @ApiProperty({ required: false, description: 'Cart key' })
  @IsOptional()
  @IsString()
  cartKey?: string;

  @ApiProperty({ type: () => LineItemsSyncCart, required: true, description: 'Business Unit ID', isArray: true })
  @Type(() => LineItemsSyncCart)
  @ArrayNotEmpty()
  @IsArray()
  lineItems: LineItemsSyncCart[];

  @ApiProperty({ required: false, description: 'Discount codes', isArray: true })
  @IsOptional()
  @IsArray()
  discountCodes?: string[];

  @ApiProperty({ required: false, description: 'Business Unit ID' })
  @IsOptional()
  @IsString()
  paymentMethod?: string; // TODO: Possible something like CASH | CREDIT | ... to define this with Adelco.
}
