import { Request, DynamicPageContext } from '@frontastic/extension-types';
import {
  findProducts,
  findProductsByCategory,
  getProductBySlug
} from '../../apis/ProductApi';
import {
  FACETS,
  UNDERSCORE_STOCK,
  getFacetFilters,
  getQueryParamsWithoutFacets
} from '../facet';
import { toQueryParams } from '../Request';
import { getDataFromContext } from '../axiosInstance';

const QUERY_DEFAULT_VALUE = {
  [UNDERSCORE_STOCK]: 'true'
};

const stockFilterValidValues = ['true', '"true"'];

const getQuerySanitized = (query: Request['query']) => {
  const queryWithDefaultValues = { ...QUERY_DEFAULT_VALUE, ...query };
  const { [UNDERSCORE_STOCK]: stock, ...restFilters } = queryWithDefaultValues;

  const stockFilterArray = Array.isArray(stock) ? stock : [stock];

  const isValidStockFilter = stockFilterArray.some((stockItem) =>
    stockFilterValidValues.some((validValue) => stockItem === validValue)
  );

  return isValidStockFilter ? queryWithDefaultValues : restFilters;
};

export const getProducts = async (
  request: Request,
  context: DynamicPageContext
) => {
  const {
    dch,
    t2z,
    useT2Rate = true,
    taxProfile
  } = request.sessionData?.userAccount || {};
  const sanitizedQuery = getQuerySanitized(request.query);

  const queryParams = getQueryParamsWithoutFacets(sanitizedQuery);
  const filter = getFacetFilters(sanitizedQuery);
  const requestData = await getDataFromContext(
    { request, ...context },
    'product'
  );

  return findProducts(
    requestData,
    toQueryParams({
      ...queryParams,
      useT2Rate,
      ...(taxProfile && { taxProfile }),
      ...(dch && t2z && { dch, t2z }),
      facet: FACETS,
      filter
    })
  );
};

export const getCategoryProducts = async (
  request: Request,
  context: DynamicPageContext,
  slug: string
) => {
  const {
    dch,
    t2z,
    useT2Rate = true,
    taxProfile
  } = request.sessionData?.userAccount || {};
  const sanitizedQuery = getQuerySanitized(request.query);

  const queryParams = getQueryParamsWithoutFacets(sanitizedQuery);
  const filter = getFacetFilters(sanitizedQuery);
  const requestData = await getDataFromContext(
    { request, ...context },
    'product'
  );

  return findProductsByCategory(
    requestData,
    toQueryParams({
      ...queryParams,
      useT2Rate,
      ...(taxProfile && { taxProfile }),
      ...(dch && { dch }),
      ...(t2z && { t2z }),
      facet: FACETS,
      filter
    }),
    slug
  );
};

export const getProduct = async (
  request: Request,
  context: DynamicPageContext,
  slug: string
) => {
  const {
    dch,
    t2z,
    useT2Rate = true,
    taxProfile
  } = request.sessionData?.userAccount || {};
  const requestData = await getDataFromContext(
    { request, ...context },
    'product'
  );
  const queryParams = getQueryParamsWithoutFacets(request.query);

  return getProductBySlug(requestData, slug, {
    ...queryParams,
    useT2Rate,
    ...(taxProfile && { taxProfile }),
    ...(dch && { dch }),
    ...(t2z && { t2z }),
    facet: FACETS
  });
};
