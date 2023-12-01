import { ApiProperty } from '@nestjs/swagger';
import { ProductSuggestionDto } from '@/products/dto/productSuggestion.dto';

const suggestionMock = {
  text: 'string'
};

export class ProductSuggestionsResponseDto {
  @ApiProperty({
    description: 'Product Suggestions for search keyword',
    required: true,
    default: [],
    type: ProductSuggestionDto,
    isArray: true,
    example: [suggestionMock]
  })
  'searchKeywords.es-CL': ProductSuggestionDto[];
}
