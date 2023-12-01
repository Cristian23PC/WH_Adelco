import React, { type FC } from 'react';
import { type LinkRenderer, type Placement } from '../../../../utils/types';
import { OffCanvas } from '../../../structure/OffCanvas';
import { type MenuItem } from '../types';
import CategoriesMenuBody from './CategoriesMenuBody';
import CategoriesMenuHeader from './CategoriesMenuHeader';

interface SubcategoriesMenuProps {
  menuData: MenuItem[];
  selectedOption: number;
  placement: Placement;
  onClose: VoidFunction;
  onBack: VoidFunction;
  linkRenderer: LinkRenderer;
}
const SubcategoriesMenu: FC<SubcategoriesMenuProps> = ({
  menuData,
  selectedOption,
  placement,
  onClose,
  onBack,
  linkRenderer
}) => {
  return (
    <OffCanvas
      show={menuData[selectedOption] !== undefined}
      placement={placement}
      isChild
    >
      <div className="grid gap-4 tablet:gap-6 content-start h-full">
        <CategoriesMenuHeader
          title={menuData[selectedOption]?.title}
          onClose={onClose}
          onBack={onBack}
          isChildMenu
        />
        <CategoriesMenuBody
          linkRenderer={linkRenderer}
          onClose={onClose}
          menuData={menuData[selectedOption]?.children ?? []}
          show={menuData[selectedOption] !== undefined}
          placement={placement}
        />
      </div>
    </OffCanvas>
  );
};

export default SubcategoriesMenu;
