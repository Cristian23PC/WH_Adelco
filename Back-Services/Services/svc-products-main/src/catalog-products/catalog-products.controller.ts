import { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { Controller, Get, Query, Param } from '@nestjs/common';
import { ApiParam, ApiOkResponse, ApiOperation, ApiTags, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { QueryArgsDto } from '../products/dto/queryargs.dto';
import { CatalogProductsService } from './catalog-products.service';
import { ProductProjectionPagedResponseDto } from '@/catalog-products/dto/productProjectionPagedResponse.dto';
import { ProductSuggestionsRequestDto } from '@/products/dto/productSuggestionsRequest.dto';
import { ProductSuggestionsResponseDto } from './dto/productSuggestionsResponse.dto';

@ApiTags('Products')
@Controller('products')
export class CatalogProductsController {
  constructor(private readonly catalogProductsService: CatalogProductsService) {}

  @ApiOkResponse({
    description: 'List of Products',
    type: ProductProjectionPagedResponseDto
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'T2 zone does not match distribution center'
  })
  @ApiOperation({
    summary: 'Return list of products'
  })
  @Get()
  async getProducts(@Query() query: QueryArgsDto): Promise<Partial<ProductProjectionPagedSearchResponse>> {
    return await this.catalogProductsService.getProductsWithPrices(query);
  }

  @Get('/by-category/:categorySlug')
  @ApiOkResponse({
    description: 'List of Products',
    type: ProductProjectionPagedResponseDto
  })
  @ApiOperation({
    summary: 'Return list of products by category slug'
  })
  @ApiBadRequestResponse({
    status: 400,
    description: 'T2 zone does not match distribution center'
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    status: 404
  })
  @ApiParam({ name: 'categorySlug', type: 'string', required: true })
  async getProductsByCategory(@Param('categorySlug') categorySlug: string, @Query() query: QueryArgsDto): Promise<Partial<ProductProjectionPagedSearchResponse>> {
    return await this.catalogProductsService.getProductsByCategorySlug(categorySlug, query);
  }

  @ApiOkResponse({
    description: 'Product Suggestions',
    status: 200,
    type: ProductSuggestionsResponseDto
  })
  @ApiOperation({
    summary: 'Return list of product suggestions'
  })
  @ApiBadRequestResponse({
    status: 400,
    description: ' * searchKeywords.es-CL must be longer than or equal to 1 characters \n * searchKeywords.es-CL must be a string \n * searchKeywords.es-CL should not be empty'
  })
  @Get('/suggestions')
  async getProductSuggestions(@Query() query: ProductSuggestionsRequestDto): Promise<Partial<ProductSuggestionsResponseDto>> {
    return await this.catalogProductsService.getProductSuggestions(query);
  }
}
