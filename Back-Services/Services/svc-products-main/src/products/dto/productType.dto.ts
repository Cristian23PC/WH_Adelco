import { CommonDto } from '@/dto/common.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ProductTypeDto extends CommonDto {
  @ApiProperty({ description: 'Unique identifier of the ProductType.' })
  id: string;

  @ApiProperty({ description: 'Current version of the ProductType.' })
  version: number;

  @ApiProperty({ description: 'User-defined unique identifier of the ProductType.', required: false })
  key: string;

  @ApiProperty({ description: 'Name of the ProductType.' })
  name: string;

  @ApiProperty({ description: 'Description of the ProductType.' })
  description: string;

  @ApiProperty({ description: 'Attributes specified for the ProductType', isArray: false, required: false })
  attributes: any[];

  @ApiProperty({ description: 'Present on resources created after 1 February 2019 except for events not tracked.', required: false })
  createdBy: string;

  @ApiProperty({ description: 'Present on resources created after 1 February 2019 except for events not tracked.', required: false })
  lastModifiedBy: string;
}

export class ProductTypeReferenceDto {
  @ApiProperty({ description: 'Unique identifier of the referenced ProductType.' })
  id: string;

  @ApiProperty({ description: '"product-type" References a ProductType.' })
  typeId: string;

  @ApiProperty({ description: 'Contains the representation of the expanded ProductType.', required: false, type: ProductTypeDto })
  obj: ProductTypeDto;
}
