import { CtProductsPageResult } from '@Types/adelco/product';
import useImmutableSWR from 'swr/immutable';
import { mutate } from 'swr';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';
import { KEY } from '../useSearchProducts';

const useGetFiveCategoryProducts = (
  slug: string,
  initialData?: CtProductsPageResult
) => {
  const fetchKey = [KEY, '?limit=5', slug];

  const { data, isLoading, isValidating } =
    useImmutableSWR<CtProductsPageResult>(
      fetchKey,
      ([url, queryParams, s]) =>
        fetchApiHub(`${url}${queryParams}`, {
          method: 'POST',
          body: JSON.stringify({ slug: s })
        }),
      { fallbackData: initialData }
    );

  const reload = () => {
    mutate(fetchKey);
  };

  return {
    products: data,
    isLoading,
    isValidating,
    reload
  };
};

export default useGetFiveCategoryProducts;
