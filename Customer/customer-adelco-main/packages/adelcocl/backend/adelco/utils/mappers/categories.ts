import { BreadcrumbItem } from '@Types/adelco/category';
import { CtCategoryExpanded } from '../../types/categories';
import { formatCapitalizeText } from './common';
import { LOCALE } from '../../config';

const normalizeLatBreadcrumb = (
  parentBreadcrumbs: BreadcrumbItem[],
  slug: string
) => {
  const lastParent = parentBreadcrumbs[parentBreadcrumbs.length - 1];

  return lastParent
    ? `/categorias/${lastParent.url}/${slug}`
    : `/categorias/${slug}`;
};

export const expandedCtCategoryToBreadcrumb = (
  ctCategoryExpanded: CtCategoryExpanded
): BreadcrumbItem[] => {
  const homeItem = { url: '/', label: 'Home' };
  if (!ctCategoryExpanded) return [homeItem];

  const { name, slug, ancestors } = ctCategoryExpanded;

  const parentBreadcrumb = ancestors
    .map(({ obj }, i, items) => {
      // OMIT ESTRUCTURA ADELCO (main category)
      if (i === 0) return null;
      return {
        url:
          i === 1
            ? obj.slug[LOCALE]
            : `${items[i - 1].obj.slug[LOCALE]}/${obj.slug[LOCALE]}`,
        label: formatCapitalizeText(obj.name[LOCALE])
      };
    })
    .filter(Boolean);

  return [
    homeItem,
    ...parentBreadcrumb.map(({ url, ...rest }) => ({
      url: `/categorias/${url}`,
      ...rest
    })),
    {
      url: normalizeLatBreadcrumb(parentBreadcrumb, slug[LOCALE]),
      label: formatCapitalizeText(name[LOCALE])
    }
  ];
};
