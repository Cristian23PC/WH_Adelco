import * as categoriesTree from '@/categories/helpers/categories-tree/categories-tree-builder.helper';

import { categoriesMock } from '@/categories/__mocks__/categories.mock';
import { categoryTreeResponseMock, cetegoryTreeThreeLevelResponseMock } from '@/categories/__mocks__/helpers/categories-tree-builder.mock';

describe('categories-tree-builder', () => {
  describe('populateChildren', () => {
    it('should populate children inside of parent category', () => {
      expect(
        categoriesTree.populateChildren(
          { ...categoriesMock[0], children: [] },
          { [categoriesMock[0].id]: [categoriesMock[1].id] },
          {
            [categoriesMock[1].id]: categoriesMock[1]
          }
        )
      ).toEqual({ ...categoriesMock[0], children: [categoriesMock[1]] });
    });
  });

  describe('categoriesTreeBuilder', () => {
    it('should return the category, not have children and use the default case', () => {
      jest.spyOn(categoriesTree, 'populateChildren').mockReturnValue(categoriesMock[0]);
      expect(categoriesTree.categoriesTreeBuilder(categoriesMock[0], categoriesMock, 1)).toEqual(categoriesMock[0]);
    });

    it('should return the category, with a child and pass for "2" case', () => {
      jest.spyOn(categoriesTree, 'populateChildren').mockReturnValue(categoryTreeResponseMock);
      expect(categoriesTree.categoriesTreeBuilder(categoriesMock[0], categoriesMock, 2)).toEqual(categoryTreeResponseMock);
    });

    it('should return the category, with a child (and inside other child) and pass for "3" case', () => {
      jest.spyOn(categoriesTree, 'populateChildren').mockReturnValue(cetegoryTreeThreeLevelResponseMock);
      const newCategoriesMock = [...categoriesMock, { ...categoriesMock[2], id: categoriesMock[2] + 'asd' }];
      expect(categoriesTree.categoriesTreeBuilder(categoriesMock[0], newCategoriesMock, 3)).toEqual(cetegoryTreeThreeLevelResponseMock);
    });
  });
});
