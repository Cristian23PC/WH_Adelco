import { Request, DynamicPageContext } from '@frontastic/extension-types';
import { findProductsByCategory } from '../apis/ProductApi';
import { findCategories } from '../apis/CategoryApi';
import { getPath, toQueryParams } from './Request';
import { FACETS, getFacetFilters, getQueryParamsWithoutFacets } from './facet';
import { getDataFromContext } from './axiosInstance';

export class CategoryRouter {
  static identifyFrom(request: Request) {
    return Boolean(getPath(request)?.match(/^\/categorias/));
  }

  static async getCategory(request: Request, context: DynamicPageContext) {
    const requestData = await getDataFromContext(
      { ...context, request },
      'product'
    );

    const urlParts = getPath(request)?.split('/');
    const slug = urlParts[urlParts.length - 1];

    return findCategories(
      requestData,
      toQueryParams({
        where: `slug(es-CL="${slug}")`,
        expand: 'ancestors[*]'
      })
    );
  }

  static async loadFor(request: Request, context: DynamicPageContext) {
    const { dch, t2z } = request.sessionData?.userAccount || {};
    const urlMatches = getPath(request)?.match(/\/categorias\/([^\/]+)/);
    const slug = urlMatches ? urlMatches[1] : '';
    const queryParams = getQueryParamsWithoutFacets(request.query);
    const filter = getFacetFilters(request.query);
    const requestData = await getDataFromContext(
      { ...context, request },
      'product'
    );

    return findProductsByCategory(
      requestData,
      toQueryParams({
        ...queryParams,
        ...(dch && { dch }),
        ...(t2z && { t2z }),
        facet: FACETS,
        filter
      }),
      slug
    );
  }
}
