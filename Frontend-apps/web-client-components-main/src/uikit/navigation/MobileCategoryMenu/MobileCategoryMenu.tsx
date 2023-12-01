import React, { type FC, useState, useRef, useEffect } from 'react';
import LoginCard, {
  type LoginCardProps,
  DEFAULT_LITERALS as loginCardLiterals
} from '../../../organisms/LoginCard/LoginCard';
import { type MenuItem, type PromotionalBanner } from '../CategoriesMenu/types';
import { Backdrop } from '../../structure';

import CategoryMenuContainer from './partials/CategoryMenuContainer';
import CategoryMenuBody from './partials/CategoryMenuBody';
import SubcategoryMenuBody from './partials/SubcategoryMenu';
import PromotionalBannerItem from './partials/PromotionalBanner';
import useClickOutside from '../../../utils/hooks/useClickOutside';
import { type LinkRenderer } from '../../../utils/types';

const DEFAULT_LITERALS = {
  categoriesTitle: 'Nuestras Categorías',
  ...loginCardLiterals
};

export interface MobileCategoryMenuProps extends LoginCardProps {
  open: boolean;
  menuData: MenuItem[];
  categoryList?: MenuItem[];
  promotionalBanners?: PromotionalBanner[];
  linkRenderer: LinkRenderer;
  onLoginClick?: VoidFunction;
  onRegisterClick?: VoidFunction;
  subcategory?: boolean;
  onClose: VoidFunction;
  literals?: typeof DEFAULT_LITERALS;
  className?: string;
  'data-testid'?: string;
}
const MobileCategoryMenu: FC<MobileCategoryMenuProps> = ({
  open = false,
  linkRenderer,
  username,
  onLoginClick,
  onRegisterClick,
  onLogoutClick,
  isLoggedIn,
  menuData,
  promotionalBanners,
  literals,
  onClose,
  className,
  'data-testid': dataTestId = 'adelco-mobile-category-menu'
}) => {
  const menuRef = useRef(null);
  useClickOutside(menuRef, onClose, open);
  const [selectedOption, setSelectedOption] = useState(-1);

  const changeBodyScroll = (disable: boolean): void => {
    document.body.classList.toggle('category-menu-open', disable);
  };

  useEffect(() => {
    if (!open) {
      setSelectedOption(-1);
    }

    changeBodyScroll(open);

    return () => {
      open && changeBodyScroll(false);
    };
  }, [open]);

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const handleExitSubcategory = (): void => {
    setSelectedOption(-1);
  };
  const handleOpenCategory = (index: number): void => {
    setSelectedOption(index);
  };
  const handleClose = (): void => {
    setSelectedOption(-1);
    onClose?.();
  };
  const handleLogin = (): void => {
    onLoginClick?.();
    handleClose();
  };

  return (
    <>
      <Backdrop
        className="z-20 desktop:opacity-0"
        show={open}
        onClick={handleClose}
      />
      <div ref={menuRef}>
        <CategoryMenuContainer
          data-testid={dataTestId}
          open={open}
          className={className}
        >
          <LoginCard
            username={username}
            onLoginClick={handleLogin}
            createAccountCallback={onRegisterClick}
            onLogoutClick={onLogoutClick}
            isLoggedIn={isLoggedIn}
            literals={l}
          />

          <CategoryMenuBody
            menuData={menuData}
            linkRenderer={linkRenderer}
            onCategoryClick={handleOpenCategory}
            onClose={onClose}
          />

          <SubcategoryMenuBody
            open={!!menuData[selectedOption]?.children}
            menuData={menuData[selectedOption]?.children ?? []}
            mainCategories={menuData}
            linkRenderer={linkRenderer}
            exitSubcategory={handleExitSubcategory}
            onClose={handleClose}
          />
          <div className="flex flex-col gap-4 p-4 w-full">
            {promotionalBanners?.map(({ imageURL, link }, index) => (
              <PromotionalBannerItem
                imageUrl={imageURL}
                link={link}
                linkRenderer={linkRenderer}
                key={index}
              />
            ))}
          </div>
        </CategoryMenuContainer>
      </div>
    </>
  );
};

MobileCategoryMenu.displayName = 'MobileCategoryMenu';

export default MobileCategoryMenu;
