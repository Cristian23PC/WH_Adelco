import { useRouter } from 'next/router';
import { CtProductsPageResult } from '@Types/adelco/product';
import useSWR from 'swr';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

const getQueryString = (query: object) =>
  Object.keys(query)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
    .join('&');

export const KEY = '/action/product/searchProducts';

const useSearchProducts = (initSearchProduct?: CtProductsPageResult) => {
  const { query, push } = useRouter();
  const { data, isLoading } = useSWR([KEY, getQueryString(query)], ([url, queryParams]) => fetchApiHub(`${url}?${queryParams}`), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });

  const onChangeQueryParams = (queryParam: Record<string, string>) => {
    const { pathname } = new URL(window.location.href);

    push({ pathname, query: { ...query, ...queryParam } }, null, { shallow: true });
  };

  return {
    productsResult: data || initSearchProduct || {},
    onChangeQueryParams,
    isLoading,
  };
};

export default useSearchProducts;
