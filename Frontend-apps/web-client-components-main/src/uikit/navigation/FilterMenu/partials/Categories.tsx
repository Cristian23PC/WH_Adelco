import React, { type FC } from 'react';
import { type LinkRenderer } from '../../../../utils/types';
import { Accordion } from '../../../structure';
import CategoryItem from './CategoryItem';
import { type CategoryList } from '../types';

interface CategoriesProps {
  categoryList: CategoryList;
  onClick: VoidFunction;
  linkRenderer: LinkRenderer;
  open: boolean;
}
const Categories: FC<CategoriesProps> = ({
  categoryList,
  linkRenderer,
  onClick,
  open
}) => {
  return (
    <Accordion
      open={open}
      onClick={onClick}
      title={`${categoryList.title} (${categoryList.count})`}
      className="mb-4 tablet:mb-6 tablet:font-bold"
      data-testid="adelco-category-list"
      variant="secondary"
    >
      <div className="flex flex-col gap-4 px-5 py-2 text-sm">
        {categoryList.categories.map((category) =>
          linkRenderer(
            category.slug,
            <CategoryItem key={category.slug} {...category} />
          )
        )}
      </div>
    </Accordion>
  );
};

export default Categories;
