import { ApiProperty } from '@nestjs/swagger';
import { LocalizedStringEntity } from './localized-string.entity';
import { DimensionsEntity } from './image.entity';
import { CustomFieldsEntity } from './custom-fields.entity';

export class AssetSource {
  @ApiProperty({ description: 'User-defined unique identifier of the AssetSource.', required: false })
  key: string;

  @ApiProperty({ description: 'URI of the AssetSource.' })
  uri: string;

  @ApiProperty({ description: 'Width and height of the AssetSource.', type: DimensionsEntity })
  dimensions: DimensionsEntity;

  @ApiProperty({ description: 'Indicates the type of content, for example application/pdf.' })
  contentType: string;
}

export class AssetEntity {
  @ApiProperty({ description: 'Unique identifier of the Asset.' })
  id: string;

  @ApiProperty({ description: 'User-defined unique identifier of the Asset.', required: false })
  key: string;

  @ApiProperty({ description: 'Custom label for the image.', isArray: true, type: AssetSource })
  sources: AssetSource[];

  @ApiProperty({ description: 'Name of the Asset.', type: LocalizedStringEntity })
  name: LocalizedStringEntity;

  @ApiProperty({ description: 'Description of the Asset.', type: LocalizedStringEntity, required: false })
  description: LocalizedStringEntity;

  @ApiProperty({ description: 'Keywords for categorizing and organizing Assets.', isArray: true })
  tags: string[];

  @ApiProperty({ description: 'Custom Fields defined for the Asset.', type: CustomFieldsEntity })
  custom: CustomFieldsEntity;
}
