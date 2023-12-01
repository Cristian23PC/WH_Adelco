import React, { type FC } from 'react';
import CategoryMenuContainer from './CategoryMenuContainer';
import CategoryMenuBody from './CategoryMenuBody';
import { type MenuItem } from '../../CategoriesMenu/types';
import SubcategoryHeader, {
  type DEFAULT_LITERALS as SubcategoryHeaderLiterals
} from './SubcategoryHeader';

interface SubcategoryMenuProps {
  open: boolean;
  onClose: VoidFunction;
  menuData: MenuItem[];
  mainCategories: MenuItem[];
  linkRenderer: any;
  exitSubcategory: VoidFunction;
  literals?: typeof SubcategoryHeaderLiterals;
}
const SubcategoryMenu: FC<SubcategoryMenuProps> = ({
  open,
  menuData,
  mainCategories,
  linkRenderer,
  onClose,
  literals,
  exitSubcategory
}) => {
  const handleCategoryClick = (_: number): void => {
    onClose?.();
  };
  return (
    <CategoryMenuContainer open={open}>
      <SubcategoryHeader
        exitSubcategory={exitSubcategory}
        linkRenderer={linkRenderer}
        categoryList={mainCategories}
        literals={literals}
        onCategoryClick={handleCategoryClick}
      />
      <CategoryMenuBody
        menuData={menuData}
        linkRenderer={linkRenderer}
        onCategoryClick={handleCategoryClick}
        onClose={onClose}
      />
    </CategoryMenuContainer>
  );
};

export default SubcategoryMenu;
