import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { EBusinessUnitsSortField } from '../enum/business-units-sort-field.enum';
import { EBusinessUnitsSort } from '../enum/business-units-sort.enum';

class Coordinates {
  @ApiProperty({
    description: 'Indicate latitude',
    type: Number,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({
    description: 'Indicate longitude',
    type: Number,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  long: number;
}

export class Address {
  @ApiProperty({
    description: 'Indicate country',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  country = 'CL';

  @ApiProperty({
    description: 'Indicate region',
    type: String,
    required: false
  })
  @IsString()
  @IsNotEmpty()
  region: string;

  @ApiProperty({
    description: 'Indicate commune',
    type: String,
    required: false
  })
  @IsString()
  @IsNotEmpty()
  commune: string;

  @ApiProperty({
    description: 'Indicate locality',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({
    description: 'Indicate street name',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  streetName: string;

  @ApiProperty({
    description: 'Indicate street number',
    type: String,
    required: true
  })
  @IsOptional()
  @IsString()
  streetNumber?: string;

  @ApiProperty({
    description: 'Indicate apartment',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  apartment?: string;

  @ApiProperty({
    description: 'Indicate other address information',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  otherInformation?: string;

  @ApiProperty({
    description: 'Coordinates of the address',
    type: () => Coordinates,
    required: false
  })
  @IsObject()
  @IsOptional()
  coordinates?: Coordinates;
}

export class UpdateRequestDto {
  @ApiProperty({
    description: 'Indicate name',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Indicate trade name',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  tradeName?: string;

  @ApiProperty({
    description: 'Indicate shipping address',
    type: () => Address,
    required: true
  })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  address: Address;

  @ApiProperty({
    description: 'Indicate billing address',
    type: () => Address,
    required: false
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  billingAddress?: Address;
}

export class FilterGetAllBusinessUnits {
  @IsEnum(EBusinessUnitsSortField)
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: EBusinessUnitsSortField,
    example: EBusinessUnitsSortField.name
  })
  sortField?: EBusinessUnitsSortField = EBusinessUnitsSortField.name;

  @IsEnum(EBusinessUnitsSort)
  @IsString()
  @IsOptional()
  @ApiProperty({
    required: false,
    enum: EBusinessUnitsSort,
    example: EBusinessUnitsSort.asc
  })
  sort?: EBusinessUnitsSort = EBusinessUnitsSort.asc;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({ required: false })
  offset?: number;
}
