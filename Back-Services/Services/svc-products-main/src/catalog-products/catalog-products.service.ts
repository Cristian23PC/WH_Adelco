import { Category, Channel, CustomObject, LocalizedString, ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '@/products/products.service';
import { DeliveryZonesService } from '@/delivery-zones/delivery-zones.service';
import { QueryArgsDto } from '@/products/dto/queryargs.dto';
import { ChannelsService } from '@/channels/channels.service';
import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { CategoriesService } from '@/categories/categories.service';
import { convertProduct } from './converter';
import { ProductSuggestionsRequestDto } from '@/products/dto/productSuggestionsRequest.dto';
import { ProductSuggestionsResponseDto } from './dto/productSuggestionsResponse.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { LoggerService } from '@/common/utils';
import loggerConfig from '@/config/logger.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CatalogProductsService {
  private readonly loggerService = new LoggerService(loggerConfig());
  constructor(
    private readonly productsService: ProductsService,
    private readonly channelsService: ChannelsService,
    private readonly customObjectsService: DeliveryZonesService,
    private readonly categoryService: CategoriesService,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async getProductsWithPrices(query: QueryArgsDto): Promise<ProductProjectionPagedSearchResponse> {
    let channel: Channel | undefined;
    let t2zone: CustomObject | undefined;
    let t2zoneValue: { dcCode: string; t2Rate: string };
    let distributionCenterKey: string | undefined;
    if (query.dch) {
      channel = await this.channelsService.getChannel(query.dch);
      distributionCenterKey = channel.custom?.fields['distributionCenterCode'];
    }
    if (query.t2z) {
      t2zone = await this.customObjectsService.getT2Zone(query.t2z);
      t2zoneValue = t2zone.value as { dcCode: string; t2Rate: string };
      if (t2zoneValue.dcCode && t2zoneValue.dcCode !== distributionCenterKey) {
        throw ErrorBuilder.buildError('t2zOverlapError');
      }
    }

    const productsResponse = await this.productsService.getProducts(distributionCenterKey, query);

    return {
      ...productsResponse,
      results: productsResponse.results.map(product => convertProduct(product, t2zoneValue, query.taxProfile, query.useT2Rate))
    };
  }

  async getProductsByCategorySlug(categorySlug: string, query: QueryArgsDto) {
    const { results: { 0: category } = [] } = await this.categoryService.query({
      limit: 1,
      where: decodeURIComponent(`slug(es-CL="${categorySlug}")`)
    });
    if (!category) throw new NotFoundException('Not Found');

    return await this.getProductsByCategory(category, query);
  }

  private async getProductsByCategory(category: Category, query: QueryArgsDto) {
    const shouldUseCache = query.limit && query.limit < 10; // Only for home page
    let cacheKey: string;

    if (shouldUseCache) {
      cacheKey = this.getProductsByCategorySlugCacheKey(category.slug, query);
      const cachedProducts = await this.cacheManager.get<ProductProjectionPagedSearchResponse>(cacheKey);
      if (cachedProducts) {
        this.loggerService.log('Cache hit: Products for Slug Category');
        return cachedProducts;
      }
    }

    query['filter.query'] = [...(Array.isArray(query['filter.query']) ? query['filter.query'] : [query['filter.query']]), `categories.id:"${category.id}"`].filter(v => !!v);

    const productsWithPrices = await this.getProductsWithPrices(query);
    if (shouldUseCache) {
      await this.cacheManager.set(cacheKey, productsWithPrices, this.configService.get<number>('products.byCategorySlugCacheTTL'));
    }
    this.loggerService.log('Cache missed: Products for Slug Category');
    return productsWithPrices;
  }

  private getProductsByCategorySlugCacheKey(categorySlug: LocalizedString, { t2z, dch }: QueryArgsDto): string {
    return `${t2z}_${dch}_${categorySlug['es-CL']}}`;
  }

  async getProductSuggestions(query: ProductSuggestionsRequestDto): Promise<Partial<ProductSuggestionsResponseDto>> {
    return this.productsService.getSuggestions(query);
  }
}
