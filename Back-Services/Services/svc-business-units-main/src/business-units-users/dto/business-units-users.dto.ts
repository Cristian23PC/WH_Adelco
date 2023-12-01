import { Address } from '@/business-units/dto/business-units.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested
} from 'class-validator';

export class PreRegistrationRequestDto {
  @ApiProperty({
    description: 'Indicate user email',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(1)
  username: string;

  @ApiProperty({
    description: "User's RUT",
    type: 'number',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  rut: string;

  @ApiProperty({
    description: `User's first name`,
    type: 'string',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: `User's last name`,
    type: 'string',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: `User's phone number`,
    type: 'string'
  })
  @IsString()
  @IsNumberString()
  @MaxLength(12)
  @MinLength(11)
  phone: string;

  @ApiProperty({
    description: `User's password`,
    type: 'string',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  password: string;
}

export class CompleteRegistrationRequestDto {
  @ApiProperty({
    description: `User's email`,
    type: 'string',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(1)
  username: string;

  @ApiProperty({
    description: `User's verification code`,
    type: 'string',
    required: true
  })
  @IsNotEmpty()
  @IsNumberString()
  code: string;
}

export class RepRegistrationRequestDto {
  @ApiProperty({
    description: `User's email`,
    type: String,
    required: false
  })
  @ValidateIf(o => !o.isFakeCustomer)
  @IsString()
  @IsEmail()
  @MinLength(1)
  username?: string;

  @ApiProperty({
    description: "User's RUT",
    type: Number
  })
  @IsNotEmpty()
  @IsString()
  rut: string;

  @ApiProperty({
    description: `User's first name`,
    type: String
  })
  @ValidateIf(o => !o.isFakeCustomer)
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @ApiProperty({
    description: `User's last name`,
    type: String
  })
  @ValidateIf(o => !o.isFakeCustomer)
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @ApiProperty({
    description: `User's phone number`,
    type: String
  })
  @ValidateIf(o => !o.isFakeCustomer)
  @IsString()
  @IsNumberString()
  @MaxLength(12)
  @MinLength(11)
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
    type: () => Address
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
    description: 'Indicate if should create a fake customer',
    type: Boolean,
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isFakeCustomer? = false;
}

export class UserAndRutValidationRequestDto {
  @ApiProperty({
    description: `User's email`,
    type: 'string'
  })
  @IsEmail()
  username: string;

  @ApiProperty({
    description: "User's RUT",
    type: Number
  })
  @IsNotEmpty()
  @IsString()
  rut: string;
}

export class UserAndRutValidationResponseDto extends UserAndRutValidationRequestDto {
  @ApiProperty({
    description: 'Business Unit Name',
    type: 'string'
  })
  buName: string;
}

export class VerificationCodeRequestDto {
  @ApiProperty({
    description: `User's email`,
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(1)
  username: string;
}

export class ResetPasswordRequestDto {
  @ApiProperty({
    description: 'Indicate user email',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(1)
  username: string;

  @ApiProperty({
    description: `User's password`,
    type: 'string'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  password: string;

  @ApiProperty({
    description: `User's verification code`,
    type: 'string'
  })
  @IsNotEmpty()
  @IsNumberString()
  @MinLength(4)
  @MaxLength(4)
  code: string;
}

export class ValidateVerificationCodeDto {
  @ApiProperty({
    description: `User's email`,
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(1)
  username: string;

  @ApiProperty({
    description: `User's verification code`,
    type: 'string'
  })
  @IsNotEmpty()
  @IsNumberString()
  code: string;
}
