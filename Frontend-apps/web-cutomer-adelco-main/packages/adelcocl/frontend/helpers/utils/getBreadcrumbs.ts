import { formatCapitalizeText } from './formatLocaleName';

export const getCategoryBreadcrumbs = (category) => {
  const elements = [{ url: '/', label: 'Home' }];

  if (category.ancestors.length > 1) {
    const categories = [...category.ancestors];
    categories.shift();
    categories.forEach((category) => {
      elements.push({
        url: `/category/${category.obj.slug['es-CL']}`,
        label: formatCapitalizeText(category.obj.name['es-CL']),
      });
    });
  }
  elements.push({
    url: `/category/${category.slug['es-CL']}`,
    label: formatCapitalizeText(category.name['es-CL']),
  });
  return elements;
};
