import { Category, CtCategory } from '@Types/adelco/category';
import { formatCapitalizeText } from '../../utils/formatLocaleName';

export const categoryMapper = (menuData: CtCategory): Category[] => {
  const categories = menuData.children?.map((category) => {
    return {
      title: formatCapitalizeText(category.name['es-CL']),
      slug: category.slug['es-CL'],
      children: categoryMapper(category),
    };
  });

  if (menuData.ancestors?.length === 1) {
    categories?.push({
      title: `Ver todo ${menuData.name['es-CL'].toLocaleLowerCase()}`,
      slug: menuData.slug['es-CL'],
      children: undefined,
    });
  }

  return categories;
};
