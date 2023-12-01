import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import {  Paginator } from '@adelco/web-components';
import { BreadcrumbItem, CtCategory } from '@Types/adelco/category';
import { CtProductsPageResult } from '@Types/adelco/product';
import { Category } from '@Types/product/Category';
import { ProductCard, Grid, NoResults, Breadcrumb } from 'am-ts-components';
import useAddLineItem from 'frontastic/actions/adelco/cart/useAddLineItem/useAddLineItem';
import useCart from 'frontastic/actions/adelco/cart/useCart/useCart';
import useSetLineItemQuantity from 'frontastic/actions/adelco/cart/useSetLineItemQuantity/useSetLineItemQuantity';
// import useSearchProducts from 'frontastic/actions/adelco/products/useSearchProducts';
import useUser from 'frontastic/actions/adelco/user/useUser';
import Filter from '../../../../../components/adelco/plp/Filter';
import FilterContext from '../../../../../contexts/Filter/FilterContext';
import { ctProductsPageToProductPage } from '../../../../../helpers/mappers/productMapper';
import { linkRenderer } from '../../../../../helpers/utils/linkRenderer';
import { updateURLParams } from '../../../../../helpers/utils/updateURLParams';
import ZoneSelector from '../../zoneSelector';
import ProductListHeader from './ProductListHeader';

interface Facet {
  terms: Array<{
    term: string;
    count: number;
  }>;
  total: number;
}

type Props = {
  data: {
    categories: {
      dataSource: {
        categories: CtCategory;
      };
    };
    data: {
      dataSource: CtProductsPageResult & {
        category?: Category;
        breadcrumb: BreadcrumbItem[];
        facets: {
          'variants.attributes.brand': Facet;
          'variants.categories.id': Facet;
        };
      };
    };
  };
};

const ProductList: FC<Props> = ({ data }) => {
  const router = useRouter();

  const { breadcrumb, category, facets, ...pageResult } = data?.data?.dataSource;
  // const { productsResult: pageResult, onChangeQueryParams } = useSearchProducts(searchPageResult);
  const { getCartItem } = useCart();
  const { trigger: setItemQuantity } = useSetLineItemQuantity();
  const { trigger: addLineItem } = useAddLineItem();
  const { user } = useUser();

  const { results, limit, offset, total } = ctProductsPageToProductPage(
    pageResult,
    Boolean(user?.dch && user?.t2z),
  );
  const searchedTerm = router.query['text.es-CL'] as string;

  const [isZoneModalOpen, setIsZoneModalOpen] = useState(false);
  const categories = data.categories?.dataSource?.categories;

  if (!data?.data?.dataSource || total === 0)
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
    setIsZoneModalOpen(true);
  };

  const handleOnCloseZoneModal = () => {
    setIsZoneModalOpen(false);
  };

  const onSort = () => {
    // TODO: - replace by the real onSort function
    console.log('onSort called');
  };

  const navigateToPage = (page: number) => {
    // onChangeQueryParams({ offset: ((page - 1) * itemsPerPage).toString() });
    router.push(updateURLParams([{ key: 'offset', value: ((page - 1) * itemsPerPage).toString() }]));
  };

  const handleChangeQuantity = (id: string, quantity: number) => {
    setItemQuantity({ id, quantity });
  };

  return (
    <FilterContext facets={facets} categoryList={categories}>
      <ZoneSelector open={isZoneModalOpen} onClose={handleOnCloseZoneModal} />
      <div className="mx-auto tablet:px-6 desktop:w-[1340px] desktop:px-0">
        <div className="mx-auto w-full px-4 py-2 tablet:px-0 desktop:w-[886px]">
          {breadcrumb && (
            <div className="hidden w-full text-xs tablet:block">
              <Breadcrumb elements={breadcrumb} linkRenderer={linkRenderer} />
            </div>
          )}
          <ProductListHeader total={totalResults} title={searchedTerm} onSort={onSort} category={category} />
        </div>
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-2 ml-auto">
            <Filter />
          </div>
          <div className="col-span-12 desktop:col-span-8 desktop:max-w-[886px]">
            <Grid className="w-full desktop:w-[886px]">
              {results.map((item) => {
                const lineItem = getCartItem(item.id);
                return (
                  <ProductCard
                    key={item.id}
                    onSeePrices={showPrices}
                    {...item}
                    onClick={() => router.push(`/product/${item.slug}`)}
                    units={lineItem?.quantity}
                    onChange={(quantity: number) => {
                      if (lineItem) {
                        handleChangeQuantity(lineItem.id, quantity);
                      }
                    }}
                    onAddToCart={() => {
                      const quantity = item.quantity || 1;
                      addLineItem({ sku: item.sku, quantity });
                    }}
                  />
                );
              })}
            </Grid>

            <div className="my-6 flex justify-center desktop:my-5">
              {totalPages > 1 && (
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
    </FilterContext>
  );
};

export default ProductList;
