import { ProductProjectionPagedSearchResponse } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductProjectionsRepository } from 'commercetools-sdk-repositories';
import { QueryArgsDto } from './dto/queryargs.dto';
import { DistributionCentersService } from '@/distribution-centers/distribution-centers.service';
import { convertProduct } from './converters';
import { InjectRepository } from '@/nest-commercetools';
import { ProductSuggestionsRequestDto } from './dto/productSuggestionsRequest.dto';
import { ProductSuggestionsResponseDto } from '@/catalog-products/dto/productSuggestionsResponse.dto';

type QueryArgsType = {
  filter?: string | string[];
  facet?: string | string[];
  'filter.query'?: string | string[];
  'filter.facets'?: string | string[];
  sort?: string | string[];
  limit?: number;
  offset?: number;
  priceCurrency?: string;
  priceCountry?: string;
  priceChannel?: string;
  expand?: string | string[];
  fuzzy?: boolean;
  'text.es-CL'?: string;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductProjectionsRepository)
    private readonly productProjectionsRepository: ProductProjectionsRepository,
    private readonly configService: ConfigService,
    private readonly distributionCentersService: DistributionCentersService
  ) {}

  async getProducts(supplyChannelKey?: string, queryArgs?: QueryArgsDto): Promise<ProductProjectionPagedSearchResponse> {
    const supplyChannel = supplyChannelKey ?? this.configService.get<string>('products.defaultSupplyChannel');

    const distributionCenter = await this.distributionCentersService.getByKey(supplyChannel);

    const availablityFilterMap: Map<string, string> = new Map([['masterVariant.availability.isOnStock=', `variants.availability.channels.${distributionCenter.id}.isOnStock:`]]);

    const ctQueryArgs: QueryArgsType = {
      offset: queryArgs?.offset ?? 0,
      limit: queryArgs?.limit ?? 20,
      expand: ['taxCategory', 'masterVariant.price.discounted.discount'],
      'filter.query': [`variants.attributes.enabledForDistributionCenters.key:"${distributionCenter.key}"`],
      sort: ['score desc', 'createdAt desc']
    };

    if (queryArgs?.dch && queryArgs?.t2z) {
      ctQueryArgs.priceCurrency = this.configService.get<string>('products.priceCurrency');
      ctQueryArgs.priceCountry = this.configService.get<string>('products.priceCountry');
      ctQueryArgs.priceChannel = queryArgs.dch;
    }

    if (queryArgs?.['text.es-CL']) {
      ctQueryArgs['text.es-CL'] = queryArgs['text.es-CL'];
      ctQueryArgs.fuzzy = ctQueryArgs['text.es-CL'].length >= +this.configService.get<number>('products.fuzzyThresholdLength');
    } else {
      ctQueryArgs.sort = ['variants.attributes.sortingPriority desc', 'createdAt desc'];
    }

    if (queryArgs?.sort && queryArgs?.sort.length > 0) {
      if (Array.isArray(queryArgs.sort)) {
        ctQueryArgs.sort = [...queryArgs.sort, ...ctQueryArgs.sort];
      } else {
        ctQueryArgs.sort = [queryArgs.sort, ...ctQueryArgs.sort];
      }
    }

    if (queryArgs?.filter) {
      if (Array.isArray(queryArgs.filter)) {
        ctQueryArgs.filter = queryArgs.filter.map(filter => {
          for (const [condition, transformation] of availablityFilterMap.entries()) {
            if (filter.includes(condition)) {
              return filter.replace(condition, transformation);
            }
          }
          return filter;
        });
      } else {
        let isAvailablityFilterEnable = false;
        for (const [condition, transformation] of availablityFilterMap.entries()) {
          if (queryArgs.filter.includes(condition)) {
            ctQueryArgs.filter = [queryArgs.filter.replace(condition, transformation)];
            isAvailablityFilterEnable = true;
            break;
          }
        }
        if (!isAvailablityFilterEnable) {
          ctQueryArgs.filter = [queryArgs.filter];
        }
      }
    }
    if (queryArgs?.facet) {
      ctQueryArgs.facet = queryArgs.facet;
    }
    if (queryArgs?.['filter.facets']) {
      ctQueryArgs['filter.facets'] = queryArgs['filter.facets'];
    }
    if (queryArgs?.['filter.query']) {
      ctQueryArgs['filter.query'] = [...ctQueryArgs['filter.query'], ...queryArgs['filter.query']];
    }
    const response = await this.productProjectionsRepository.search({
      queryArgs: ctQueryArgs
    });

    return {
      ...response,
      results: response.results.map(product => convertProduct(product, distributionCenter.id))
    };
  }

  async getSuggestions(productSuggestionsRequest: ProductSuggestionsRequestDto): Promise<Partial<ProductSuggestionsResponseDto>> {
    return this.productProjectionsRepository.suggest({
      queryArgs: {
        fuzzy: productSuggestionsRequest.fuzzy,
        limit: productSuggestionsRequest.limit,
        staged: productSuggestionsRequest.staged,
        'searchKeywords.es-CL': productSuggestionsRequest['searchKeywords.es-CL']
      }
    });
  }
}