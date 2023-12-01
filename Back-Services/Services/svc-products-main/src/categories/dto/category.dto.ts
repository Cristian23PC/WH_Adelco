import { LocalizedStringDto } from '@/dto/localizedString.dto';
import { AssetDto } from '@/dto/asset.dto';
import { ApiProperty } from '@nestjs/swagger';
import { CustomFieldsDto } from '@/dto/customFields.dto';
import { CommonDto } from '@/dto/common.dto';
import CategoriesMock from '../__test__/fixtures/CategoriesMock.json';

export class CategoryDto extends CommonDto {
  @ApiProperty({ description: 'Unique identifier of the Category.', example: CategoriesMock[0].id })
  id: string;

  @ApiProperty({ description: 'Current version of the Category.', example: CategoriesMock[0].version })
  version: number;

  @ApiProperty({ description: 'User-defined unique identifier of the Category.', required: false, example: CategoriesMock[0].key })
  key: string;

  @ApiProperty({
    description: 'Additional identifier for external systems like Customer Relationship Management (CRM) or Enterprise Resource Planning (ERP).',
    required: false,
    example: CategoriesMock[0].externalId
  })
  externalId: string;

  @ApiProperty({ description: 'Name of the Category.', example: CategoriesMock[0].name })
  name: LocalizedStringDto;

  @ApiProperty({ description: 'User-defined identifier used as a deep-link URL to the related Category per Locale.', example: CategoriesMock[0].slug })
  slug: LocalizedStringDto;

  @ApiProperty({ description: 'Description of the Category.', required: false, example: CategoriesMock[0].description })
  description: LocalizedStringDto;

  @ApiProperty({ description: 'Contains the parent path towards the root Category.', isArray: true, required: false, example: CategoriesMock[0].ancestors })
  ancestors: any[];

  @ApiProperty({ description: 'Parent Category of this Category.', example: CategoriesMock[0].parent })
  parent: any[];

  @ApiProperty({ description: 'Decimal value between 0 and 1 used to order Categories that are on the same level in the Category tree.', example: CategoriesMock[0].orderHint })
  orderHint: string;

  @ApiProperty({
    description: 'Name of the Category used by external search engines for improved search engine performance.',
    required: false,
    example: CategoriesMock[0].metaTitle
  })
  metaTitle: LocalizedStringDto;

  @ApiProperty({
    description: 'Description of the Category used by external search engines for improved search engine performance.',
    required: false
  })
  metaDescription: LocalizedStringDto;

  @ApiProperty({ description: 'Keywords related to the Category for improved search engine performance.', required: false })
  metaKeywords: LocalizedStringDto;

  @ApiProperty({ description: 'Media related to the Category.', required: false, isArray: true, example: CategoriesMock[0].assets })
  assets: AssetDto[];

  @ApiProperty({ description: 'Custom Fields for the Category.', required: false, example: CategoriesMock[0].custom })
  custom: CustomFieldsDto;

  @ApiProperty({ description: 'Present on resources created after 1 February 2019 except for events not tracked.', required: false })
  createdBy: string;

  @ApiProperty({ description: 'Present on resources created after 1 February 2019 except for events not tracked.', required: false })
  lastModifiedBy: string;
}
