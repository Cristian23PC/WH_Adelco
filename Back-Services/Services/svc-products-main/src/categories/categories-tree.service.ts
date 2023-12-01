import { Injectable } from '@nestjs/common';

import { CategoriesService } from './categories.service';

import { GetCategoriesTreeQueryArgsDto } from './dto/queryargs.dto';

import { CategoryTree } from './interfaces';

import { categoriesTreeBuilder } from './helpers/categories-tree/categories-tree-builder.helper';
import { Category, CategoryPagedQueryResponse } from '@commercetools/platform-sdk';

@Injectable()
export class CategoriesTreeService {
  constructor(private readonly categoriesService: CategoriesService) {}

  async getCategoriesTree({ rootKey, childLevels }: GetCategoriesTreeQueryArgsDto): Promise<CategoryTree> {
    const category = await this.categoriesService.getByKey(rootKey);

    const categories = await this.getCategoriesByPages(category, []);

    const categoriesTree = categoriesTreeBuilder(category, categories, childLevels as number);
    return categoriesTree;
  }

  async getCategoriesByPages(category: Category, categories: Category[], lastId?: string): Promise<Category[]> {
    const query = {
      where: `ancestors(id="${category.id}")`,
      withTotal: true,
      sort: 'id',
      limit: 500
    };
    if (lastId) {
      query.where = decodeURIComponent(`ancestors(id="${category.id}") and id>"${lastId}"`);
    }
    const categoryPaged: CategoryPagedQueryResponse = await this.categoriesService.query(query);
    categories.push(...categoryPaged.results);

    if (categoryPaged.count === 500) {
      const lastCategory = categoryPaged.results[categoryPaged.results.length - 1];
      await this.getCategoriesByPages(category, categories, lastCategory.id);
    }

    return categories;
  }
}
