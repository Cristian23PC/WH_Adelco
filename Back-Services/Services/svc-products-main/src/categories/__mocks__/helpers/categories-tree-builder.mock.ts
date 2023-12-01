import { CategoryTree } from '@/categories/interfaces';
import { categoriesMock } from '../categories.mock';

export const categoryTreeResponseMock: CategoryTree = {
  ...categoriesMock[0],
  children: [categoriesMock[1]]
};

export const cetegoryTreeThreeLevelResponseMock: CategoryTree = {
  ...categoriesMock[0],
  children: [
    {
      ...categoriesMock[1],
      children: [categoriesMock[2]]
    }
  ]
};
