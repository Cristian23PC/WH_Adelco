import { CategoryDto } from '@/categories/dto/category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { VariantDto } from './variant.dto';
import { LocalizedStringDto } from '@/dto/localizedString.dto';
import { ProductTypeReferenceDto } from './productType.dto';
import { Exclude } from 'class-transformer';
import { StateReferenceDto } from './state.dto';
import { CommonDto } from '@/dto/common.dto';

class ReviewRatingStatisticsDto {
  @ApiProperty({ description: 'Average rating of one target This number is rounded with 5 decimals.' })
  averageRating: number;

  @ApiProperty({ description: 'Highest rating of one target' })
  highestRating: number;

  @ApiProperty({ description: 'Lowest rating of one target' })
  lowestRating: number;

  @ApiProperty({ description: 'Number of ratings taken into account' })
  count: number;

  @ApiProperty({
    description:
      'Full distribution of the ratings. The keys are the different ratings and the values are the count of reviews having this rating. Only the used ratings appear in this object.'
  })
  ratingsDistribution: object;
}

class CategoryReferenceDto {
  @ApiProperty({ description: 'Unique identifier of the referenced Category.' })
  id: string;

  @ApiProperty({ description: '"category" References a Category.' })
  typeId: string;

  @ApiProperty({
    description: 'Contains the representation of the expanded Category. Only present in responses to requests with Reference Expansion for Categories.',
    type: CategoryDto,
    required: false
  })
  obj: CategoryDto;
}

export class ProductProjectionDto extends CommonDto {
  @ApiProperty({ description: 'Unique identifier of the Product.' })
  id: string;

  @ApiProperty({ description: 'Current version of the Product.' })
  version: number;

  @ApiProperty({ description: 'User-defined unique identifier of the Product.', required: false })
  key: string;

  @ApiProperty({ description: 'The ProductType defining the Attributes of the Product.', type: ProductTypeReferenceDto })
  productType: ProductTypeReferenceDto;

  @ApiProperty({ description: 'Name of the Product.' })
  name: LocalizedStringDto<'es-CL'>;

  @ApiProperty({ description: 'Description of the Product.', required: false })
  description: LocalizedStringDto<'es-CL'>;

  @ApiProperty({ description: 'User-defined identifier used in a deep-link URL for the Product.' })
  slug: LocalizedStringDto<'es-CL'>;

  @ApiProperty({ description: 'Categories assigned to the Product.', type: CategoryReferenceDto, isArray: true })
  categories: CategoryReferenceDto[];

  @ApiProperty({ description: 'Order of Product in Categories.', required: false })
  categoryOrderHints: any;

  @ApiProperty({ description: 'Title of the Product displayed in search results.', required: false })
  metaTitle: LocalizedStringDto<'es-CL'>;

  @ApiProperty({ description: 'Description of the Product displayed in search results below the meta title.', required: false })
  metaDescription: LocalizedStringDto<'es-CL'>;

  @ApiProperty({ description: 'Keywords that give additional information about the Product to search engines.', required: false })
  metaKeywords: LocalizedStringDto<'es-CL'>;

  @ApiProperty({ description: 'Used by Product Suggestions, but is also considered for a full text search.', required: false })
  searchKeywords: any;

  @ApiProperty({ description: 'true if the staged data is different from the current data.', required: false })
  hasStagedChanges: boolean;

  @ApiProperty({ description: 'true if the Product is published.', required: false })
  published: boolean;

  @ApiProperty({
    description: 'The Master Variant of the Product.',
    type: VariantDto
  })
  masterVariant: VariantDto;

  @ApiProperty({
    description: 'Additional Product Variants.',
    required: true,
    default: [],
    isArray: true,
    type: VariantDto
  })
  variants: VariantDto[];

  @Exclude()
  taxCategory: any;

  @ApiProperty({ description: 'State of the Product.', required: false, type: StateReferenceDto })
  state: StateReferenceDto;

  @ApiProperty({ description: 'Review statistics of the Product.', required: false, type: ReviewRatingStatisticsDto })
  reviewRatingStatistics: ReviewRatingStatisticsDto;

  @ApiProperty({ description: 'Indicates whether the Prices of the Product Projection are embedded or standalone.', required: false })
  priceMode: any;
}
