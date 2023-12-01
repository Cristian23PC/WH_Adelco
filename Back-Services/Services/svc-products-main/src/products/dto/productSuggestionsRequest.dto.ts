import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBooleanString, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';

export class ProductSuggestionsRequestDto {
  @ApiProperty({
    description: 'Retrieves suggestion text from the SearchKeywords of ProductData in the given language.',
    type: 'string',
    isArray: false,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  'searchKeywords.es-CL': string;

  @ApiProperty({
    description: 'Limit (default 10)',
    type: 'number',
    isArray: false,
    required: false
  })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  @Max(100)
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Whether to use fuzzy search (default false)',
    type: 'boolean',
    isArray: false,
    required: false
  })
  @IsOptional()
  @IsBooleanString()
  fuzzy?: boolean;

  @ApiProperty({
    description: 'Whether to search in the current or staged projections. (default false)',
    type: 'boolean',
    isArray: false,
    required: false
  })
  @IsOptional()
  @IsBooleanString()
  staged?: boolean;
}
