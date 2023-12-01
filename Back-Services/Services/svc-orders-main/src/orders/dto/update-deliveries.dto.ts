import { ISO8601_REGEX, IsMatchingRegex } from '@/common/decorator/isMatchingRegex';
import { IsNotFutureDate } from '@/common/decorator/isNotFutureDate';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { DELIVERY_STATUS } from '../enum/orders.enum';
import { Coordinates } from '@/common/dto/coordinates.dto';
import { CommonPaymentsDtoRequest } from './common-payment.dto';

export class NoDeliveredItemsDto {
  @ApiProperty({ required: true, description: 'Delivery item ID' })
  @IsNotEmpty()
  @IsString()
  lineItemCtId: string;

  @ApiProperty({ required: true, description: 'Quantity not delivered item' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class TaxedPriceDto {
  @ApiProperty({
    description: 'Total net of the delivery.',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  totalNet: number;

  @ApiProperty({
    description: 'Total gross of the delivery.',
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  totalGross: number;

  @ApiProperty({
    description: 'Total tax.',
    type: Number,
    required: false
  })
  @IsOptional()
  @IsNumber()
  totalTax?: number;
}

export class UpdateDeliveriesDtoRequest extends CommonPaymentsDtoRequest {
  @ApiProperty({ required: true, description: 'Delivery commercetools Id' })
  @IsNotEmpty()
  @IsString()
  deliveryId: string;

  @ApiProperty({ required: true, description: 'Delivery SAP document Id' })
  @IsNotEmpty()
  @IsString()
  documentId: string;

  @ApiProperty({ required: true, description: 'Delivery SAP Transport document Id' })
  @IsNotEmpty()
  @IsString()
  transportDocumentId: string;

  @ApiProperty({ description: 'Date of the visit', required: true })
  @IsMatchingRegex(ISO8601_REGEX, {
    message: 'time should be a valid ISO 8601 timestamp'
  })
  @IsNotFutureDate({
    message: 'time should not be a future date'
  })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Status of the delivery process', enum: DELIVERY_STATUS, example: DELIVERY_STATUS.DELIVERED, required: true })
  @IsEnum(DELIVERY_STATUS)
  @IsNotEmpty()
  status: DELIVERY_STATUS;

  @ApiProperty({
    description: 'The reason that the delivery can not be completed',
    example: '513',
    isArray: false,
    required: false
  })
  @ValidateIf(o => o.status !== DELIVERY_STATUS.DELIVERED)
  @IsNotEmpty()
  @IsString()
  noDeliveryReason: string;

  @ApiProperty({ type: () => NoDeliveredItemsDto, required: false, description: 'No delivered items', isArray: true })
  @ValidateIf(o => o.status !== DELIVERY_STATUS.DELIVERED)
  @Type(() => NoDeliveredItemsDto)
  @IsArray()
  @IsNotEmpty()
  noDeliveredItems: NoDeliveredItemsDto[];

  @ApiProperty({ type: () => TaxedPriceDto, required: false, description: 'New delivery total with the delivered items' })
  @Type(() => TaxedPriceDto)
  @ValidateIf(o => o.status === DELIVERY_STATUS.PARTIAL)
  @IsNotEmpty()
  newDeliveryTotal: TaxedPriceDto;

  @ApiProperty({ description: 'Coordinates to be provided when complete the delivery' })
  @Type(() => Coordinates)
  @IsOptional()
  deliveryCoordinates?: Coordinates;
}
