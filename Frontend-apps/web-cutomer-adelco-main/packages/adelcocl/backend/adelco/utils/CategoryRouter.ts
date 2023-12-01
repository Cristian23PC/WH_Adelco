import { Request, DynamicPageContext } from '@frontastic/extension-types';
import { findProductsByCategory } from '../apis/ProductApi';
import { findCategories } from '../apis/CategoryApi';
import { getPath, toQueryParams } from './Request';
import { FACETS, getFacetFilters, getQueryParamsWithouFacets } from './facet';

export class CategoryRouter {
  static identifyFrom(request: Request) {
    return Boolean(getPath(request)?.match(/^\/category/));
  }

  static async getCategory(request: Request, context: DynamicPageContext) {
    const baseURL = context.frontasticContext?.project.configuration.msURL.product;

    const urlMatches = getPath(request)?.match(/\/category\/([^\/]+)/);
    const slug = urlMatches ? urlMatches[1] : '';
    return findCategories(baseURL, toQueryParams({ where: `slug(es-CL="${slug}")`, expand: 'ancestors[*]' }));
  }

  static async loadFor(request: Request, context: DynamicPageContext) {
    const { dch, t2z } = request.sessionData?.userAccount || {};
    const urlMatches = getPath(request)?.match(/\/category\/([^\/]+)/);
    const slug = urlMatches ? urlMatches[1] : '';
    const queryParams = getQueryParamsWithouFacets(request.query);
    const filter = getFacetFilters(request.query);

    const baseURL = context.frontasticContext?.project.configuration.msURL.product;

    return findProductsByCategory(
      baseURL,
      toQueryParams({
        ...queryParams,
        ...(dch && { dch }),
        ...(t2z && { t2z }),
        facet: FACETS,
        filter,
      }),
      slug,
    );
  }
}
