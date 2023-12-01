import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NoResults, Paginator, Breadcrumb } from '@adelco/web-components';
import useCart from 'frontastic/actions/adelco/cart/useCart/useCart';
import useSearchProducts from 'frontastic/actions/adelco/products/useSearchProducts';
import useUser from 'frontastic/actions/adelco/user/useUser';
import ProductListHeader from './ProductListHeader';
import Filter from '../../../../../components/adelco/plp/Filter';
import { useFilterContext } from '../../../../../contexts/Filter/FilterContext';
import { ctProductsPageToProductPage } from '../../../../../helpers/mappers/productMapper';
import { linkRenderer } from '../../../../../helpers/utils/linkRenderer';
import { ProductListProps } from '.';
import Loader from 'components/adelco/Loader';
import useTrackSearch from 'helpers/hooks/analytics/useTrackSearch';
import useTrackViewPrices from 'helpers/hooks/analytics/useTrackViewPrices';
import useLoaderOnRoutes from 'helpers/hooks/useLoader';
import ProductGrid from './ProductGrid';
import { useModalContext } from '../../../../../contexts/modalContext';

const ProductListTastic: FC<ProductListProps> = ({ data }) => {
  const { trackViewPrices } = useTrackViewPrices();
  const router = useRouter();
  const [avoidValidationLoader, setAvoidValidationLoader] = useState(false);
  const { openLoginModal } = useModalContext();

  const { loading: isFiltering } = useLoaderOnRoutes([
    '/category',
    '/categoria',
    '/search'
  ]);

  useEffect(() => {
    if (isFiltering) {
      setAvoidValidationLoader(true);
    } else {
      setTimeout(() => {
        setAvoidValidationLoader(false);
      }, 1000);
    }
  }, [isFiltering]);

  const { breadcrumb, category, facets, ...productResult } =
    data?.data?.dataSource;
  const {
    productsResult: pageResult,
    onChangeQueryParams,
    isValidating: resultsValidating
  } = useSearchProducts(productResult, category?.slug['es-CL']);
  const { user } = useUser();

  const { getCartItem } = useCart();
  const { activeFilters } = useFilterContext();

  const { results, limit, offset, total } = ctProductsPageToProductPage(
    pageResult,
    Boolean(user?.dch && user?.t2z)
  );

  useTrackSearch(total);

  const searchedTerm = router.query['text.es-CL'] as string;

  const hasFiltersApplied = activeFilters?.length;

  if (!data?.data?.dataSource || (total === 0 && !hasFiltersApplied))
    return (
      <NoResults
        searchedTerm={searchedTerm}
        onClick={() => {
          console.log('Clicked Buscar');
        }}
      />
    );

  let itemsPerPage = 20;
  let totalPages = 0;
  let currentPage = 0;
  let totalResults = 0;

  if (results != null) {
    itemsPerPage = limit;
    totalPages = Math.ceil(total / limit);
    currentPage = Math.ceil(offset / itemsPerPage) + 1;
    totalResults = total;
  }

  const showPrices = () => {
    trackViewPrices();
    openLoginModal();
  };

  const navigateToPage = (page: number) => {
    onChangeQueryParams({ offset: ((page - 1) * itemsPerPage).toString() });
    window.scrollTo(0, 0);
    // router.push(updateURLParams([{ key: 'offset', value: ((page - 1) * itemsPerPage).toString() }]));
  };

  return (
    <>
      {resultsValidating && !avoidValidationLoader && <Loader />}
      <div className="mx-auto overflow-hidden tablet:px-6 desktop:w-[1340px] desktop:px-0">
        <div className="mx-auto w-full px-4 py-2 tablet:px-0 desktop:w-[886px]">
          {breadcrumb && (
            <div className="hidden w-full text-xs tablet:block">
              <Breadcrumb elements={breadcrumb} linkRenderer={linkRenderer} />
            </div>
          )}
          <ProductListHeader
            total={totalResults}
            title={searchedTerm}
            category={category}
          />
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-2 ml-auto">
            <Filter />
          </div>
          <div className="col-span-12 px-4 tablet:px-0 desktop:col-span-8 desktop:max-w-[886px]">
            <ProductGrid
              total={total}
              results={results}
              isLoading={isFiltering}
              showPrices={showPrices}
              getCartItem={getCartItem}
              breadcrumb={breadcrumb}
              category={category}
            />

            <div className="my-6 flex justify-center desktop:my-5">
              {totalPages > 1 && !isFiltering && (
                <Paginator
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onClick={(page: number) => {
                    navigateToPage(page);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductListTastic;
