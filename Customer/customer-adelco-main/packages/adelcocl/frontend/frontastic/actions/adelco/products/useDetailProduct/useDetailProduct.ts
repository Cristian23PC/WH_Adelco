import { CtProduct } from '@Types/adelco/product';
import useImmutableSWR from 'swr/immutable';
import { mutate } from 'swr';
import { fetchApiHub } from 'frontastic/lib/fetch-api-hub';

export const KEY = '/action/product/searchProduct';

const useDetailProduct = (initialData: CtProduct, slug: string) => {
  const fetchKey = [KEY, slug];

  const { data, isLoading, isValidating } = useImmutableSWR<CtProduct>(
    fetchKey,
    ([url, s]) =>
      fetchApiHub(`${url}`, {
        method: 'POST',
        body: JSON.stringify({ slug: s })
      }),
    { fallbackData: initialData }
  );

  const reload = () => {
    mutate(fetchKey);
  };

  return {
    product: data,
    isLoading,
    isValidating,
    reload
  };
};

export default useDetailProduct;
