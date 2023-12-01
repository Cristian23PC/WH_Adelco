import { toQueryParams } from '../Request';
import { findCategories } from '../../apis/CategoryApi';
import { expandedCtCategoryToBreadcrumb } from '../mappers/categories';

export const getCategoryBreadcrumb = async (baseURL: string, categoryId: string) => {
  const categoriesPageResult = await findCategories(
    baseURL,
    toQueryParams({ where: `id="${categoryId}"`, expand: 'ancestors[*]' }),
  );
  const category = categoriesPageResult?.results?.[0] || null;
  return expandedCtCategoryToBreadcrumb(category);
};
