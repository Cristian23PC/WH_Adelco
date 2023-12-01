import { Trim } from '@/dto/custom-tranformers/custom-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsOptional, IsString, MinLength } from 'class-validator';

export class GetCategoriesQueryArgsDto {
  @ApiProperty({
    description: 'Indicate the query',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(1, { each: true })
  where?: string[];

  @ApiProperty({
    description: 'Indicates if a property reference must be expanded',
    type: [String],
    required: false
  })
  @IsOptional()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @MinLength(1, { each: true })
  expand?: string | string[];

  @ApiProperty({
    description: 'Indicates total amount of categories',
    type: 'number',
    required: false
  })
  @IsOptional()
  @IsNumberString()
  limit?: string | number;

  @ApiProperty({
    description: 'Indicates total amount should be skipped',
    type: 'number',
    required: false
  })
  @IsOptional()
  @IsNumberString()
  offset?: string | number;
}

export class GetCategoriesTreeQueryArgsDto {
  @ApiProperty({
    description: 'Indicates the key of category',
    type: 'string',
    minLength: 2,
    required: true
  })
  @Trim()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  rootKey: string;

  @ApiProperty({
    description: 'Indicates the number of levels you want to go deeper',
    type: 'number',
    required: false
  })
  @IsOptional()
  @Trim()
  @IsNumberString()
  childLevels?: string | number;
}
