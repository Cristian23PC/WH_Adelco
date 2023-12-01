import React, { useRef, forwardRef, type RefObject } from 'react';
import { type LinkRenderer, type Placement } from '../../../utils/types';
import { OffCanvas } from '../../structure/OffCanvas';
import CategoriesMenuBody from './components/CategoriesMenuBody';
import CategoriesMenuHeader from './components/CategoriesMenuHeader';
import { type MenuItem } from './types';
import useClickOutside from '../../../utils/hooks/useClickOutside';
import classNames from 'classnames';

export interface CategoriesMenuProps {
  title: string;
  menuData: MenuItem[];
  open: boolean;
  onClose: VoidFunction;
  placement?: Placement;
  'data-testid'?: string;
  linkRenderer: LinkRenderer;
  className?: string;
  style?: React.CSSProperties;
}
const CategoriesMenu = forwardRef<HTMLDivElement, CategoriesMenuProps>(
  (
    {
      title,
      menuData,
      open = false,
      onClose,
      placement = 'left',
      linkRenderer,
      className,
      style,
      'data-testid': testId = 'categories-menu'
    },
    menuIconRef
  ) => {
    const menuRef = useRef(null);
    useClickOutside(
      [menuRef, menuIconRef as RefObject<HTMLDivElement>],
      onClose,
      open
    );

    return (
      <OffCanvas
        className={className}
        backdropClassName={classNames('!z-[25]')}
        style={style}
        data-testid={testId}
        onClose={onClose}
        show={open}
        placement={placement}
      >
        <div
          ref={menuRef}
          className="grid gap-4 tablet:gap-6 content-start h-full"
        >
          <CategoriesMenuHeader title={title} onClose={onClose} />
          <CategoriesMenuBody
            linkRenderer={linkRenderer}
            placement={placement}
            onClose={onClose}
            menuData={menuData}
            show={open}
          />
        </div>
      </OffCanvas>
    );
  }
);

CategoriesMenu.displayName = 'CategoriesMenu';
export default CategoriesMenu;
