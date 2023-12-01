import { Category } from '@commercetools/platform-sdk';

type CategoriesTree = Category[] | (Category & { children?: Category[] })[];
type Children = {
  children?: CategoriesTree;
};

export type CategoryTree = Category & Children;

export type ReverseIDsMap = {
  [id: string]: string[];
};

export type CategoriesMap = {
  [id: string]: Category;
};
