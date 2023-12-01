import { QueryParam } from '@commercetools/platform-sdk';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class QueryArgsDto {
  [key: string]: QueryParam;

  @ApiProperty({
    description: 'Fields to expand',
    type: 'string',
    isArray: true,
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  expand?: string | string[];
}

export class VerificationCartRequestArgsDto {
  @ApiProperty({ description: 'Force full verification of prices and stock', type: 'boolean', required: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  forceUpdate?: boolean;
}

export class GetAnonymousCartRequestArgsDto extends VerificationCartRequestArgsDto {
  @ApiProperty({
    description: 'Delivery zone',
    type: 'string',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  deliveryZone: string;
}
