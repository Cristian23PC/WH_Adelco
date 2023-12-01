import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';

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
export class OrderContactRequestDto {
  @ApiProperty({
    description: 'Contact Email',
    type: 'string'
  })
  @IsOptional()
  username?: string;

  @ApiProperty({
    description: 'Contact Rut',
    type: 'string'
  })
  @IsNotEmpty()
  rut: string;

  @ApiProperty({
    description: 'Contact First Name',
    type: 'string',
    required: false
  })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    description: 'Contact Last Name',
    type: 'string',
    required: false
  })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    description: 'Contact Phone',
    type: 'string'
  })
  @IsOptional()
  phone?: string;

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
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  billingAddress: Address;
}
