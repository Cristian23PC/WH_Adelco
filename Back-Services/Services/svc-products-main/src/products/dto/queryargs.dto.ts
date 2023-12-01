import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumberString, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { TaxProfile } from '@adelco/price-calc';

export class QueryArgsDto {
  @ApiProperty({
    description: 'Offset',
    type: 'number',
    isArray: false,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  offset?: number;

  @ApiProperty({
    description: 'Limit',
    type: 'number',
    isArray: false,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  limit?: number;

  @ApiProperty({
    description: 'Distribution channel ID',
    type: 'string',
    isArray: false,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(36)
  @MaxLength(36)
  dch?: string;

  @ApiProperty({
    description: 'T2 zone key',
    type: 'string',
    isArray: false,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  t2z?: string;

  @ApiProperty({
    description: 'Text to search for in the specified format: text.es-CL',
    type: 'string',
    isArray: false,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  'text.es-CL'?: string;

  @ApiProperty({
    description: 'Filters to apply after facets',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(1, { each: true })
  filter?: string[] | string;

  @ApiProperty({
    description: 'Filters to apply before facets',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(1, { each: true })
  'filter.query'?: string[];

  @ApiProperty({
    description: 'Filters to apply to all facets calculations',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(1, { each: true })
  'filter.facets'?: string[];

  @ApiProperty({
    description: 'Facets to apply',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(1, { each: true })
  facet?: string[];

  @ApiProperty({
    description: 'Sorting conditions',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(1, { each: true })
  sort?: string[];

  @ApiProperty({
    description: 'Tax profile code that apply to products',
    type: String,
    required: false
  })
  @IsOptional()
  @MaxLength(2)
  @MinLength(1)
  taxProfile?: TaxProfile;

  @ApiProperty({
    description: 'Indicate if use t2rate',
    type: Boolean,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  useT2Rate?: boolean;
}
