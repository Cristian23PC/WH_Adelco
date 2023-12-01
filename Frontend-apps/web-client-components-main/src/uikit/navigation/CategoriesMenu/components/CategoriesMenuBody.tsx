import classNames from 'classnames';
import React, { type FC, useState, useEffect } from 'react';
import { type LinkRenderer, type Placement } from '../../../../utils/types';
import { type MenuItem } from '../types';
import CategoryItem from './CategoryItem';
import SubcategoriesMenu from './SubcategoriesMenu';

interface CategoriesMenuBodyProps {
  menuData: MenuItem[];
  show: boolean;
  placement: Placement;
  onClose: VoidFunction;
  linkRenderer: LinkRenderer;
}
const CategoriesMenuBody: FC<CategoriesMenuBodyProps> = ({
  menuData,
  placement,
  linkRenderer,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState(-1);

  const closeChildMenu = (): void => {
    setSelectedOption(-1);
  };

  useEffect(() => {
    closeChildMenu();
  }, [menuData]);

  const handleClick = (index: number): void => {
    if (selectedOption === index || menuData[index].children === undefined) {
      closeChildMenu();
    } else {
      setSelectedOption(index);
    }
  };

  return (
    <>
      <ul
        data-testid="adelco-menu-body"
        className={classNames(
          'overflow-y-auto flex flex-col gap-2 tablet:gap-4'
        )}
      >
        {menuData.map((item, index) => (
          <CategoryItem
            active={selectedOption === index}
            key={item.title}
            linkRenderer={linkRenderer}
            item={item}
            onClick={() => {
              if (item.children === undefined || item.children.length === 0) {
                onClose();
              }
              handleClick(index);
            }}
          />
        ))}
      </ul>
      <SubcategoriesMenu
        linkRenderer={linkRenderer}
        placement={placement}
        menuData={menuData}
        selectedOption={selectedOption}
        onClose={onClose}
        onBack={closeChildMenu}
      />
    </>
  );
};

export default CategoriesMenuBody;
