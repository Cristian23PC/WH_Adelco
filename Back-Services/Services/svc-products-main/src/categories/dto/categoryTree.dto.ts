import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import CategoriesJSON from '../__test__/fixtures/CategoriesMock.json';

export class CategoryTreeDto extends CategoryDto {
  @ApiProperty({
    description: 'Category',
    type: CategoryTreeDto,
    isArray: true,
    required: false,
    example: { ...CategoriesJSON[0], children: [{ ...CategoriesJSON[0], children: [] }] }
  })
  children: CategoryTreeDto[];
}
