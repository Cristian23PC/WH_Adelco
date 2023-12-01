import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DeliveryDatesQueryDto {
  @ApiProperty({
    description: 'Indicate quantity options for delivery dates',
    type: Number,
    default: 3,
    required: false,
    minimum: 1,
    maximum: 5
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @Type(() => Number)
  options = 3;
}

export class DeliveryDateDto {
  @ApiProperty({
    description: 'Start date and time'
  })
  startDateTime: string;

  @ApiProperty({
    description: 'End date and time'
  })
  endDateTime: string;
}

export class DeliveryDatesResponseDto {
  @ApiProperty({
    description: 'List of payment methods',
    isArray: true,
    required: true,
    nullable: true,
    type: DeliveryDateDto
  })
  @ValidateNested({ each: true })
  @Type(() => DeliveryDateDto)
  deliveryDates: DeliveryDateDto[];
}

export class AddDeliveryDateDto {
  @ApiProperty({
    description: 'Delivery date selected',
    required: true
  })
  @IsISO8601()
  @IsNotEmpty()
  date: string;
}
