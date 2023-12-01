import React, { useEffect, type FC, useState } from 'react';
import { type MenuItem } from '../../CategoriesMenu/types';
import CategoryItem from '../../CategoriesMenu/components/CategoryItem';
import { type LinkRenderer } from '../../../../utils/types';
import classNames from 'classnames';
interface CategoriesMenuBodyProps {
  menuData: MenuItem[];
  linkRenderer: LinkRenderer;
  onCategoryClick: (index: number) => void;
  onClose: VoidFunction;
}
const CategoryMenuBody: FC<CategoriesMenuBodyProps> = ({
  menuData,
  linkRenderer,
  onCategoryClick,
  onClose
}) => {
  const [maxHeight, setMaxHeight] = useState('100%');

  useEffect(() => {
    const handleResize: VoidFunction = () => {
      const navbarHeight = window.innerWidth > 768 ? 191 : 169;
      setMaxHeight(`${window.innerHeight - navbarHeight}px`);
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return (
    <ul
      data-testid="adelco-menu-body"
      className={classNames(
        'overflow-y-auto scrollbar-thin flex flex-col gap-2 tablet:gap-4'
      )}
      style={{ maxHeight }}
    >
      {menuData.map((item, index) => (
        <CategoryItem
          key={item.title}
          linkRenderer={linkRenderer}
          item={item}
          onClick={() => {
            if (item.children === undefined || item.children.length === 0) {
              onClose();
            }
            onCategoryClick(index);
          }}
        />
      ))}
    </ul>
  );
};

export default CategoryMenuBody;
