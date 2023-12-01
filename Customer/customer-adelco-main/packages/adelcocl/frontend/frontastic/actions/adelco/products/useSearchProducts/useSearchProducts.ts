import { useRouter } from 'next/router';
import { CtProductsPageResult } from '@Types/adelco/product';
import useSWR from 'swr';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

const getQueryString = (query: object) =>
  Object.keys(query)
    .map(
      (key) => encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
    )
    .join('&');

export const KEY = '/action/product/searchProducts';

const useSearchProducts = (
  initSearchProduct?: CtProductsPageResult,
  slug?: string
) => {
  const {
    query: { path, locale, slug: s, ...query },
    push
  } = useRouter();

  const { data, isLoading, isValidating } = useSWR(
    [KEY, getQueryString(query), slug],
    ([url, queryParams, s]) =>
      fetchApiHub(`${url}?${queryParams}`, {
        method: 'POST',
        body: JSON.stringify({ slug: s })
      }),
    {
      revalidateOnFocus: false,
      fallbackData: initSearchProduct
    }
  );

  const onChangeQueryParams = (queryParam: Record<string, string>) => {
    const { pathname } = new URL(window.location.href);

    push({ pathname, query: { ...query, ...queryParam } }, null, {
      shallow: true
    });
  };

  return {
    productsResult: data || {},
    onChangeQueryParams,
    isLoading,
    isValidating
  };
};

export default useSearchProducts;
