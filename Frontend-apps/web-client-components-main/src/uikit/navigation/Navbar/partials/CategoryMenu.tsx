import React, { type RefObject, type FC } from 'react';
import MobileCategoryMenu, {
  type MobileCategoryMenuProps
} from '../../MobileCategoryMenu/MobileCategoryMenu';
import CategoriesMenu, {
  type CategoriesMenuProps
} from '../../CategoriesMenu/CategoriesMenu';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';

export interface Props extends MobileCategoryMenuProps, CategoriesMenuProps {
  categoryMenuTopPosition: number;
  navbarMenuIconRef: RefObject<HTMLDivElement>;
}
const CategoryMenu: FC<Props> = ({
  menuData,
  title,
  linkRenderer,
  username,
  onLoginClick,
  onLogoutClick,
  onRegisterClick,
  isLoggedIn,
  open,
  onClose,
  navbarMenuIconRef,
  categoryMenuTopPosition,
  promotionalBanners
}) => {
  const { isDesktop } = useScreen();

  return (
    <>
      {isDesktop && (
        <CategoriesMenu
          style={{ top: `${categoryMenuTopPosition}px` }}
          title={title}
          menuData={menuData}
          open={open}
          onClose={onClose}
          linkRenderer={linkRenderer}
          ref={navbarMenuIconRef}
        />
      )}
      {!isDesktop && (
        <MobileCategoryMenu
          linkRenderer={linkRenderer}
          username={username}
          className="top-12 tablet:top-[60px] max-h-[calc(100vh-48px)] tablet:max-h-[calc(100vh-60px)]"
          onLoginClick={onLoginClick}
          onLogoutClick={onLogoutClick}
          onRegisterClick={onRegisterClick}
          open={open}
          isLoggedIn={isLoggedIn}
          menuData={menuData}
          onClose={onClose}
          promotionalBanners={promotionalBanners}
        />
      )}
    </>
  );
};

export default CategoryMenu;
