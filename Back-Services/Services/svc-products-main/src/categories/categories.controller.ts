import { CacheTTL, Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { GetCategoriesQueryArgsDto, GetCategoriesTreeQueryArgsDto } from './dto/queryargs.dto';

import { CategoriesService } from './categories.service';
import { CategoriesTreeService } from './categories-tree.service';

import { CategoryTree } from './interfaces';
import { CategoryPagedQueryResponse } from '@commercetools/platform-sdk';
import { CategoryProjectionPagedResponseDto } from './dto/productProjectionPagedResponse.dto';
import { CategoryTreeDto } from './dto/categoryTree.dto';
import { CacheInterceptor } from '@nestjs/cache-manager';

const CACHE_TTL = 86400000; // One day

@ApiTags('Categories')
@UseInterceptors(CacheInterceptor)
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesTreeService: CategoriesTreeService, private readonly categoriesService: CategoriesService) {}

  @CacheTTL(CACHE_TTL)
  @Get()
  @ApiOkResponse({
    description: 'List of Categories',
    type: CategoryProjectionPagedResponseDto
  })
  @ApiOperation({
    summary: 'Return list of categories'
  })
  async getCategories(@Query() queries: GetCategoriesQueryArgsDto): Promise<CategoryPagedQueryResponse> {
    const formatQueries = {
      ...queries,
      limit: +queries.limit || undefined,
      offset: +queries.offset || undefined
    };

    return await this.categoriesService.query(formatQueries);
  }

  @CacheTTL(CACHE_TTL)
  @Get('tree')
  @ApiOkResponse({
    description: 'Tree of Categories',
    type: CategoryTreeDto
  })
  @ApiOperation({
    summary: 'Return a tree of categories',
    description: ''
  })
  async getCategoriesTree(@Query() queries: GetCategoriesTreeQueryArgsDto): Promise<CategoryTree> {
    const formatQueries = {
      rootKey: queries.rootKey.toUpperCase(),
      childLevels: +queries.childLevels || 0
    };

    return await this.categoriesTreeService.getCategoriesTree(formatQueries);
  }
}
