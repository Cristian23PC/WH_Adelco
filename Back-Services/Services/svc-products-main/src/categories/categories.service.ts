import { Category, CategoryPagedQueryResponse } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from 'commercetools-sdk-repositories';
import { queryArgsCt } from './interfaces/categories.interface';
import { InjectRepository } from '@/nest-commercetools';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesRepository)
    private readonly categoriesRepository: CategoriesRepository
  ) {}

  async getByKey(key: string): Promise<Category> {
    return await this.categoriesRepository.getByKey(key);
  }

  async query(queryArgs?: queryArgsCt): Promise<CategoryPagedQueryResponse> {
    return await this.categoriesRepository.find({
      queryArgs
    });
  }
}
