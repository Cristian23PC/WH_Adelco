import React, { forwardRef } from 'react';
import { Button } from '../../../actions/Button';
import { Logo } from '../../../../foundation/Logo';
import { type LinkRenderer } from '../../../../utils/types';
import { Icon } from '../../../feedback';
import { type ScreenSize } from '../../../../utils/hooks/useScreen';

interface MenuNavbarProps {
  onClick: VoidFunction;
  linkRenderer: LinkRenderer;
  isCategoryMenuOpen: boolean;
  isSearchOpen: boolean;
  screenSize: ScreenSize;
}
const MenuNavbar = forwardRef<HTMLDivElement, MenuNavbarProps>(
  (
    {
      onClick,
      linkRenderer,
      isCategoryMenuOpen,
      isSearchOpen,
      screenSize: { isMobile }
    },
    ref
  ) => {
    return (
      <div className="flex desktop:flex-row-reverse items-center gap-2 tablet:gap-4 desktop:gap-6">
        <div className="flex items-center" ref={ref}>
          {/* MOBILE & TABLET */}
          <button onClick={onClick} className="p-1 desktop:hidden">
            <Icon
              name={isCategoryMenuOpen || isSearchOpen ? 'close' : 'menu'}
              className="fill-current"
              width={isMobile ? 24 : 28}
              height={isMobile ? 24 : 28}
              color="white"
            />
          </button>

          {/* DESKTOP */}
          <Button
            onClick={onClick}
            variant="tertiary"
            iconName={isCategoryMenuOpen ? 'close' : 'menu'}
            size="sm"
            className="hidden desktop:flex"
          >
            Categorías
          </Button>
        </div>
        {linkRenderer(
          '/',
          <div className="cursor-pointer">
            <Logo
              variant="white-isotype"
              className="tablet:hidden"
              width={32}
              height={32}
            />
            <Logo variant="white" className="hidden tablet:flex" />
          </div>
        )}
      </div>
    );
  }
);

MenuNavbar.displayName = 'MenuNavbar';

export default MenuNavbar;
