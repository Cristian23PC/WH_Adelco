import { ErrorBuilder } from '@/common/utils/error-builder/error-builder';
import { InjectRepository } from '@/nest-commercetools/decorators/nest-commercetools.decorators';
import { ProductProjection } from '@commercetools/platform-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductProjectionsRepository } from 'commercetools-sdk-repositories';

type QueryArgsType = {
  sort?: string | string[];
  limit?: number;
  offset?: number;
  priceCurrency?: string;
  priceCountry?: string;
  priceChannel?: string;
  expand?: string | string[];
  where?: string | string[];
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductProjectionsRepository)
    private readonly productProjectionsRepository: ProductProjectionsRepository,
    private readonly configService: ConfigService
  ) {}

  private readonly defaultExpand = ['taxCategory', 'masterVariant.price.discounted.discount'];
  private readonly defaultSort = ['createdAt desc'];

  async getProductBySku(sku: string, distributionCenterKey: string, distributionChannelId?: string): Promise<ProductProjection> {
    const results = await this.findProducts([sku], distributionCenterKey, distributionChannelId);

    if (results.length === 0) {
      throw ErrorBuilder.buildError('productNotFound', {
        sku,
        distributionCenterKey,
        distributionChannelId
      });
    }

    return results[0];
  }

  async findAllProducts(skus: string[], distributionCenterKey: string, distributionChannelId?: string): Promise<ProductProjection[]> {
    const limit = 500;
    let lastId = null;
    let hasMore = true;

    const products = [];

    const ctSkusQuery = skus.map(sku => `"${sku}"`).join(',');

    const ctQueryArgs: QueryArgsType = {
      offset: 0,
      expand: this.defaultExpand,
      sort: 'id asc',
      where: [
        `masterVariant(attributes(name="enabledForDistributionCenters" AND value(key="${distributionCenterKey}")))`,
        `variants(sku in (${ctSkusQuery})) OR masterVariant(sku in (${ctSkusQuery}))`
      ]
    };

    if (distributionChannelId) {
      ctQueryArgs.priceCurrency = this.configService.get<string>('products.priceCurrency');
      ctQueryArgs.priceCountry = this.configService.get<string>('products.priceCountry');
      ctQueryArgs.priceChannel = distributionChannelId;
    }

    while (hasMore) {
      const combinedWhere = lastId ? [...ctQueryArgs.where, `id > "${lastId}"`] : ctQueryArgs.where;

      const { results } = await this.productProjectionsRepository.find({
        queryArgs: {
          ...ctQueryArgs,
          where: combinedWhere,
          withTotal: false,
          limit
        }
      });

      products.push(...results);

      hasMore = results.length === limit;

      lastId = results[results.length - 1]?.id;
    }

    return products;
  }

  async findProducts(skus: string[], distributionCenterKey: string, distributionChannelId?: string): Promise<ProductProjection[]> {
    const ctSkusQuery = skus.map(sku => `"${sku}"`).join(',');
    const ctQueryArgs: QueryArgsType = {
      offset: 0,
      expand: this.defaultExpand,
      sort: this.defaultSort,
      where: [
        `masterVariant(attributes(name="enabledForDistributionCenters" AND value(key="${distributionCenterKey}")))`,
        `variants(sku in (${ctSkusQuery})) OR masterVariant(sku in (${ctSkusQuery}))`
      ]
    };

    if (distributionChannelId) {
      ctQueryArgs.priceCurrency = this.configService.get<string>('products.priceCurrency');
      ctQueryArgs.priceCountry = this.configService.get<string>('products.priceCountry');
      ctQueryArgs.priceChannel = distributionChannelId;
    }

    const response = await this.productProjectionsRepository.find({ queryArgs: ctQueryArgs });

    return response.results;
  }
}
