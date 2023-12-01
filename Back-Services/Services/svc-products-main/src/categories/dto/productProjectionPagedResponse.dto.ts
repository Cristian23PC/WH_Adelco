import { ApiProperty } from '@nestjs/swagger';
import { CommonProjectionPagedResponseDto } from '@/dto/CommonProjectionPagedResponse.dto';
import { CategoryDto } from './category.dto';
import CategoriesMock from '../__test__/fixtures/CategoriesMock.json';

export class CategoryProjectionPagedResponseDto extends CommonProjectionPagedResponseDto {
  @ApiProperty({
    description: 'ProductProjections matching the query.',
    required: true,
    default: [],
    type: CategoryDto,
    isArray: true,
    example: [CategoriesMock[0]]
  })
  results: CategoryDto[];
}
