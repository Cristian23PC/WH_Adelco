import { CustomFieldsDto } from '@/dto/customFields.dto';
import { LocalizedStringDto } from '@/dto/localizedString.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DimensionsDto } from '../products/dto/image.dto';

export class AssetSource {
  @ApiProperty({ description: 'User-defined unique identifier of the AssetSource.', required: false })
  key: string;

  @ApiProperty({ description: 'URI of the AssetSource.' })
  uri: string;

  @ApiProperty({ description: 'Width and height of the AssetSource.', type: DimensionsDto })
  dimensions: DimensionsDto;

  @ApiProperty({ description: 'Indicates the type of content, for example application/pdf.' })
  contentType: string;
}

export class AssetDto {
  @ApiProperty({ description: 'Unique identifier of the Asset.' })
  id: string;

  @ApiProperty({ description: 'User-defined unique identifier of the Asset.', required: false })
  key: string;

  @ApiProperty({ description: 'Custom label for the image.', isArray: true, type: AssetSource })
  sources: AssetSource[];

  @ApiProperty({ description: 'Name of the Asset.', type: LocalizedStringDto })
  name: LocalizedStringDto;

  @ApiProperty({ description: 'Description of the Asset.', type: LocalizedStringDto, required: false })
  description: LocalizedStringDto;

  @ApiProperty({ description: 'Keywords for categorizing and organizing Assets.', isArray: true })
  tags: string[];

  @ApiProperty({ description: 'Custom Fields defined for the Asset.', type: CustomFieldsDto })
  custom: CustomFieldsDto;
}
