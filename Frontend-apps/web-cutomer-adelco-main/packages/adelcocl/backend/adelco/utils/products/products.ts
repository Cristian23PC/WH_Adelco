import { Request, DynamicPageContext } from '@frontastic/extension-types';
import { findProducts } from '../../apis/ProductApi';
import { FACETS, getFacetFilters, getQueryParamsWithouFacets } from '../facet';
import { toQueryParams } from '../Request';

export const getProducts = (request: Request, context: DynamicPageContext) => {
  const { dch, t2z } = request.sessionData?.userAccount || {};
  const queryParams = getQueryParamsWithouFacets(request.query);
  const filter = getFacetFilters(request.query);
  const baseURL = context.frontasticContext?.project.configuration.msURL.product;

  return findProducts(
    baseURL,
    toQueryParams({
      ...queryParams,
      ...(dch && t2z && { dch, t2z }),
      facet: FACETS,
      filter,
    }),
  );
};
