import { Category, CtCategory } from '@Types/adelco/category';
import { formatCapitalizeText } from '../../utils/formatLocaleName';

const LOCALE = 'es-CL';

export const categoryMapper = (
  menuData: CtCategory,
  slug: string = ''
): Category[] => {
  const categories = menuData?.children?.map((category) => {
    return {
      title: formatCapitalizeText(category.name[LOCALE]),
      slug: `/categorias${slug}/${category.slug[LOCALE]}`,
      children: categoryMapper(category, `/${category.slug[LOCALE]}`)
    };
  });

  if (menuData?.ancestors?.length === 1) {
    categories?.push({
      title: `Ver todo ${menuData.name[LOCALE].toLocaleLowerCase()}`,
      slug: `/categorias/${menuData.slug[LOCALE]}`,
      children: undefined
    });
  }

  return categories;
};
