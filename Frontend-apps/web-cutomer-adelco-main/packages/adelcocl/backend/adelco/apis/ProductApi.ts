import { LOCALE } from '../config';
import { toQueryParams } from '../utils/Request';
import fetch from 'node-fetch';

export const findProducts = async (baseURL: string, queryParams: string) => {
  const response = await fetch(`${baseURL}/products${queryParams}`);
  return response.json();
};

export const findProductsByCategory = async (baseURL: string, queryParams: string, slug: string) => {
  const response = await fetch(`${baseURL}/products/by-category/${slug}${queryParams}`);
  return response.json();
};

export const getProductBySlug = async (baseURL: string, slug: string, paramsObj: Record<string, string> = {}) => {
  const params = toQueryParams({ ...paramsObj, filter: `slug.${LOCALE}:"${slug}"` });
  const productPageResults = await findProducts(baseURL, params);
  return productPageResults?.results?.[0] || null;
};
