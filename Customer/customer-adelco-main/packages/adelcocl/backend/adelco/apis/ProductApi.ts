import axios, { RequestData } from '../../adelco/utils/axiosInstance';
import { LOCALE } from '../config';
import { ApiResponseType, toQueryParams } from '../utils/Request';

export const findProducts = async (
  requestData: RequestData,
  queryParams: string
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<unknown, ApiResponseType<any>>(
    `${baseURL}/products${queryParams}`,
    { headers }
  );
  return { data, sessionData };
};

export const findProductsByCategory = async (
  requestData: RequestData,
  queryParams: string,
  slug: string
) => {
  const { baseURL, headers } = requestData;
  const { data, sessionData } = await axios.get<unknown, ApiResponseType<any>>(
    `${baseURL}/products/by-category/${slug}${queryParams}`,
    { headers }
  );
  return { data, sessionData };
};

export const getProductBySlug = async (
  requestData: RequestData,
  slug: string,
  paramsObj: Record<string, string> = {}
) => {
  const params = toQueryParams({
    ...paramsObj,
    filter: `slug.${LOCALE}:"${slug}"`
  });
  const { data: productPageResults, sessionData } = await findProducts(
    requestData,
    params
  );
  return { data: productPageResults?.results?.[0] || null, sessionData };
};
