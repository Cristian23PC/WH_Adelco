import { getPath, toQueryParams } from '../Request';
import { findCategories } from '../../apis/CategoryApi';
import { expandedCtCategoryToBreadcrumb } from '../mappers/categories';
import { Request } from '@frontastic/extension-types';
import { RequestData } from '../axiosInstance';
import { LOCALE } from '../../config';

export const getCategoriesExpanded = async (
  requestData: RequestData,
  categoryId: string
) => {
  const { data: categoriesPageResult } = await findCategories(
    requestData,
    toQueryParams({ where: `id="${categoryId}"`, expand: 'ancestors[*]' })
  );
  return categoriesPageResult?.results?.[0] || null;
};

export const getCategoryBreadcrumb = async (
  requestData: RequestData,
  categoryId: string
) => {
  const categories = await getCategoriesExpanded(requestData, categoryId);
  return expandedCtCategoryToBreadcrumb(categories);
};

export const getCategorySlugByUrl = (request: Request): string => {
  const urlParts = getPath(request)?.split('/') ?? [''];
  return urlParts[urlParts.length - 1];
};

export const getCategoryUrl = async (
  requestData: RequestData,
  categoryId: string
) => {
  const categories = await getCategoriesExpanded(requestData, categoryId);

  const slug = categories.ancestors.reduce((acc, { obj: { slug } }, index) => {
    if (index === 0) return acc; // Omit structure adelco category
    return `${acc}/${slug[LOCALE]}`;
  }, `/categorias`);

  return `${slug}/${categories.slug[LOCALE]}`;
};
