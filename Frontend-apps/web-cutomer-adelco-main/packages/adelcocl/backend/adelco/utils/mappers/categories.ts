import { BreadcrumbItem } from '@Types/adelco/category';
import { CtCategoryExpanded } from '../../types/categories';
import { formatCapitalizeText } from './common';
import { LOCALE } from '../../config';

export const expandedCtCategoryToBreadcrumb = (ctCategoryExpanded: CtCategoryExpanded): BreadcrumbItem[] => {
  const homeItem = { url: '/', label: 'Home' };
  if (!ctCategoryExpanded) return [homeItem];

  const { name, slug, ancestors } = ctCategoryExpanded;

  const parentBreadcrumb = ancestors
    .map(({ obj }, i) => {
      // OMIT ESTRUCTURA ADELCO (main category)
      if (i === 0) return null;
      return {
        url: `/category/${obj.slug[LOCALE]}`,
        label: formatCapitalizeText(obj.name[LOCALE]),
      };
    })
    .filter(Boolean);

  return [
    homeItem,
    ...parentBreadcrumb,
    { url: `/category/${slug[LOCALE]}`, label: formatCapitalizeText(name[LOCALE]) },
  ];
};
