import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNotEmptyObject, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Address } from './business-units.dto';

class ContactInfoDto {
  @ApiProperty({
    description: 'Indicate email',
    type: String,
    required: false
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Indicate firstName',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Indicate lastName',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Indicate phone',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString()
  phone: string;
}

export class CreateDivisionRequestDto {
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

  @ApiProperty({
    description: 'Indicate contact info',
    type: () => ContactInfoDto,
    required: false
  })
  @IsOptional()
  @Type(() => ContactInfoDto)
  @ValidateNested()
  contactInfo: ContactInfoDto;
}
