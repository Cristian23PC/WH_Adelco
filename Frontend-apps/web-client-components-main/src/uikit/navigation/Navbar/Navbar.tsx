/* eslint-disable */
import React, { useState, type FC, useRef, useEffect } from 'react';
import classnames from 'classnames';
import Menu from './partials/Menu';
import ComunaNavbar from './partials/ComunaNavbar';
import User, {
  DEFAULT_LITERALS as USER_DEFAULT_LITERALS
} from './partials/User';
import { Backdrop } from '../../structure/Backdrop';
import Searchbox, {
  type SearchboxProps
} from '../../input/Searchbox/Searchbox';
import useScreen, { type ScreenSize } from '../../../utils/hooks/useScreen';
import { LinkRenderer } from '../../../utils/types';
import { type UserMenuProps } from './partials/User/UserMenu/UserMenu';
import CategoryMenu, {
  type Props as CategoryMenuProps
} from './partials/CategoryMenu';

export const DEFAULT_LITERALS = {
  ...USER_DEFAULT_LITERALS
};

const OPEN_SECTIONS = {
  CATEGORIES_MENU: 'categories-menu',
  SEARCH: 'search',
  ZONE: 'zone',
  USER_MENU: 'user-menu'
};

export interface Props {
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  'data-testid'?: string;
  searchboxProps: SearchboxProps;
  linkRenderer: LinkRenderer;
  menuProps: Pick<
    CategoryMenuProps,
    'title' | 'menuData' | 'linkRenderer' | 'promotionalBanners'
  >;
  onClickUser?: VoidFunction;
  onRegisterClick: VoidFunction;
  onClickCart?: VoidFunction;
  onClickAddress?: VoidFunction;
  isLoggedIn?: boolean;
  zoneLabel?: string;
  cartQuantity?: number;
  openTooltipOnMount?: boolean;
  userMenuProps: UserMenuProps;
}

type OpenSection = (typeof OPEN_SECTIONS)[keyof typeof OPEN_SECTIONS] | null;

const Navbar: FC<Props> = ({
  literals,
  'data-testid': dataTestId = 'navbar',
  searchboxProps,
  menuProps,
  userMenuProps,
  onClickUser = () => null,
  onClickCart = () => null,
  onRegisterClick,
  onClickAddress,
  isLoggedIn = false,
  linkRenderer,
  zoneLabel,
  cartQuantity,
  openTooltipOnMount = false
}) => {
  const [openSection, setOpenSection] = useState<OpenSection>(
    openTooltipOnMount ? OPEN_SECTIONS.ZONE || OPEN_SECTIONS.USER_MENU : null
  );
  const screenSize = useScreen();
  const navbarRef = useRef<HTMLDivElement | null>(null);
  const navbarMenuIconRef = useRef<HTMLDivElement>(null);
  const [categoryMenuTopPosition, setCategoryMenuTopPosition] = useState(0);

  const [isComunaSticky, setComunaSticky] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const screenType = Object.keys(screenSize).find(
    (key) => screenSize[key as keyof ScreenSize] === true
  );

  useEffect(() => {
    setMenuTopPosition();
  }, [screenType]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      if (currentScrollPos <= lastScrollPos) {
        setComunaSticky(true);
      } else {
        setComunaSticky(false);
      }
      setLastScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollPos]);

  const searchProps = {
    ...searchboxProps,
    onFlyoutOpen: () => {
      setOpenSection(OPEN_SECTIONS.SEARCH);
    },
    onFlyoutClose: () => {
      setOpenSection(null);
    },
    flyoutOpen: openSection === OPEN_SECTIONS.SEARCH
  };

  const userProps = {
    ...userMenuProps,
    open: openSection === OPEN_SECTIONS.USER_MENU,
    onClose: () => {
      setOpenSection(null);
    }
  };

  const setMenuTopPosition = () => {
    let topPosition = 0;

    const navbarPosition = navbarRef?.current?.getBoundingClientRect();

    if (navbarPosition) {
      topPosition = navbarPosition.bottom > 0 ? navbarPosition.bottom : 0;
    }

    setCategoryMenuTopPosition(topPosition);

    return topPosition;
  };

  const handleOnClickMenu = (): void => {
    if (
      openSection === OPEN_SECTIONS.CATEGORIES_MENU ||
      openSection === OPEN_SECTIONS.SEARCH
    ) {
      setOpenSection(null);
    } else {
      setMenuTopPosition();

      setOpenSection(OPEN_SECTIONS.CATEGORIES_MENU);
    }
  };

  const handleOnClickUserMenu = (): void => {
    if (!isLoggedIn) {
      onClickUser();
    } else {
      setOpenSection(OPEN_SECTIONS.USER_MENU);
    }
  };

  return (
    <>
      <div
        className={classnames(
          'sticky top-0 bg-corporative-02 grid desktop:place-items-center desktop:border-b-silver z-30'
        )}
        ref={navbarRef}
      >
        <div
          data-testid={dataTestId}
          className={classnames(
            'flex gap-x-3 gap-y-2 py-2 px-4 w-100',
            'desktop:flex-nowrap tablet:gap-x-4 tablet:px-6',
            'desktop:gap-6 desktop:py-4 desktop:w-[1340px]'
          )}
        >
          <Menu
            linkRenderer={linkRenderer}
            onClick={handleOnClickMenu}
            isCategoryMenuOpen={openSection === OPEN_SECTIONS.CATEGORIES_MENU}
            isSearchOpen={openSection === OPEN_SECTIONS.SEARCH}
            screenSize={screenSize}
            ref={navbarMenuIconRef}
          />
          <ComunaNavbar
            zoneLabel={zoneLabel}
            onClickAddress={onClickAddress}
            isLoggedIn={isLoggedIn}
            showTooltip={openSection === OPEN_SECTIONS.ZONE}
            screenSize={screenSize}
            className="hidden desktop:flex"
          />
          <User
            className="grow desktop:grow-0 desktop:ml-auto"
            searchboxProps={searchProps}
            literals={l}
            onClickUser={handleOnClickUserMenu}
            screenSize={screenSize}
            isLoggedIn={isLoggedIn}
            cartQuantity={cartQuantity}
            onClickCart={onClickCart}
            userMenuProps={userProps}
            ref={navbarMenuIconRef}
          />
        </div>
      </div>
      {zoneLabel && (
        <div
          className={classnames(
            'desktop:hidden',
            'bg-corporative-02 z-20 transition-all duration-500 ease-in-out',
            {
              'z-90': openSection === OPEN_SECTIONS.ZONE
            },
            isComunaSticky && zoneLabel
              ? 'sticky top-12 tablet:top-[60px] transform translate-y-0'
              : 'relative translate-y-[-100%]'
          )}
        >
          <ComunaNavbar
            zoneLabel={zoneLabel}
            onClickAddress={onClickAddress}
            isLoggedIn={isLoggedIn}
            showTooltip={openSection === OPEN_SECTIONS.ZONE}
            screenSize={screenSize}
          />
        </div>
      )}

      <CategoryMenu
        title={menuProps.title}
        categoryMenuTopPosition={categoryMenuTopPosition}
        linkRenderer={menuProps.linkRenderer}
        username={userProps.username}
        onLoginClick={onClickUser}
        onRegisterClick={onRegisterClick}
        onLogoutClick={userProps.onLogout}
        open={openSection === OPEN_SECTIONS.CATEGORIES_MENU}
        isLoggedIn={isLoggedIn}
        menuData={menuProps.menuData}
        onClose={() => setOpenSection(null)}
        navbarMenuIconRef={navbarMenuIconRef}
        promotionalBanners={menuProps.promotionalBanners}
      />
      <Backdrop
        show={Boolean(
          [
            OPEN_SECTIONS.SEARCH,
            OPEN_SECTIONS.ZONE,
            OPEN_SECTIONS.USER_MENU
          ].includes(openSection || '')
        )}
      />
    </>
  );
};

export default Navbar;
