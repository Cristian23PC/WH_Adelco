import { CategoriesMap, CategoryTree, ReverseIDsMap } from '@/categories/interfaces';
import { Category } from '@commercetools/platform-sdk';

export const populateChildren = (category: CategoryTree, reverseMap: ReverseIDsMap, categoriesMap: CategoriesMap) => {
  const childrenCategories: string[] = reverseMap[category.id];

  if (childrenCategories) {
    childrenCategories.forEach(catId => populateChildren(categoriesMap[catId], reverseMap, categoriesMap));
    category.children = childrenCategories.map(child => categoriesMap[child]);
  }
  return category;
};

export const categoriesTreeBuilder = (category: Category, categories: Category[], childLevels: number): CategoryTree => {
  const relevantCategories = categories.filter(cat => cat.ancestors.length <= category.ancestors.length + childLevels);
  const reverseMap = relevantCategories.reduce((acc: ReverseIDsMap, cat) => {
    if (cat.parent) {
      const reverseIds: string[] = acc[cat.parent.id];
      if (reverseIds) {
        acc[cat.parent.id] = [...reverseIds, cat.id];
      } else {
        acc[cat.parent.id] = [cat.id];
      }
    }
    return acc;
  }, {});
  const categoriesMap = relevantCategories.reduce((acc: CategoriesMap, cat) => {
    acc[cat.id] = cat;
    return acc;
  }, {});

  return populateChildren(category, reverseMap, categoriesMap);
};
