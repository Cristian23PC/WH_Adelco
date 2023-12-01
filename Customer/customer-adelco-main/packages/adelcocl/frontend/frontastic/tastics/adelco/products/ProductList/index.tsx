import { FC } from 'react';
import { BreadcrumbItem, CtCategory } from '@Types/adelco/category';
import { CtProductsPageResult } from '@Types/adelco/product';
import { Category } from '@Types/product/Category';
import FilterContext from '../../../../../contexts/Filter/FilterContext';
import ProductListTastic from './ProductListTastic';

interface Facet {
  terms: Array<{
    term: string;
    count: number;
  }>;
  total: number;
}

export type ProductListProps = {
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

const ProductList: FC<ProductListProps> = ({ data }) => {
  const { facets } = data?.data?.dataSource;

  const categories = data.categories?.dataSource?.categories;
  const currentCategory = data?.data?.dataSource?.category;

  return (
    <FilterContext
      facets={facets}
      categoryList={categories}
      currentCategory={currentCategory}
    >
      <ProductListTastic data={data} />
    </FilterContext>
  );
};

export default ProductList;
