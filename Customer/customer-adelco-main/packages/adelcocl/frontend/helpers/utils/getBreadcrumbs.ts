import { formatCapitalizeText } from './formatLocaleName';

const LOCALE = 'es-CL';

export const getCategoryBreadcrumbs = (category) => {
  const elements = [{ url: '/', label: 'Home' }];

  if (category.ancestors.length > 1) {
    const categories = [...category.ancestors];
    categories.shift();
    categories.forEach((category) => {
      elements.push({
        url: `/categorias/${category.obj.slug[LOCALE]}`,
        label: formatCapitalizeText(category.obj.name[LOCALE])
      });
    });
  }
  elements.push({
    url: `/categorias/${category.slug[LOCALE]}`,
    label: formatCapitalizeText(category.name[LOCALE])
  });
  return elements;
};
