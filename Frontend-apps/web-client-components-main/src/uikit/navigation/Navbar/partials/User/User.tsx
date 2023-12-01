import React, { useEffect, useRef, useState, forwardRef } from 'react';
import classnames from 'classnames';
import { Button } from '../../../../actions/Button';
import { Searchbox, type SearchboxProps } from '../../../../input/Searchbox';
import { type ScreenSize } from '../../../../../utils/hooks/useScreen';
import { CartIndicator, Icon } from '../../../../feedback';
import UserMenu, { type UserMenuProps } from './UserMenu/UserMenu';

export const DEFAULT_LITERALS = {
  loginLabel: 'Ingresar'
};

export interface UserNavbarProps {
  className?: string;
  searchboxProps: SearchboxProps;
  onClickUser: VoidFunction;
  onClickCart: VoidFunction;
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
  screenSize: ScreenSize;
  isLoggedIn?: boolean;
  cartQuantity?: number;
  userMenuProps: UserMenuProps;
}

const UserNavbar = forwardRef<HTMLDivElement, UserNavbarProps>(
  (
    {
      className,
      searchboxProps,
      onClickUser,
      onClickCart,
      literals,
      screenSize: { isMobile, isTablet },
      isLoggedIn = false,
      cartQuantity = 0,
      userMenuProps
    },
    menuIconRef
  ) => {
    const [runAnimation, setRunAnimation] = useState(false);

    const didUpdate = useRef(false);

    useEffect(() => {
      setRunAnimation(false);
      if (didUpdate.current) {
        setRunAnimation(true);
      }
      didUpdate.current = true;
    }, [cartQuantity]);

    const onAnimationEnd: any = () => {
      setRunAnimation(false);
    };

    return (
      <div
        className={classnames(
          'flex items-center gap-3 tablet:gap-12 desktop:gap-14',
          className
        )}
      >
        <div className="w-full desktop:w-[437px] flex items-center">
          <Searchbox {...searchboxProps} ref={menuIconRef} />
        </div>
        <div className="flex gap-4">
          <div className="hidden flex-col relative desktop:flex">
            <Button
              onClick={onClickUser}
              variant="tertiary"
              iconName={isLoggedIn ? 'user_active' : 'person_outline'}
              className={classnames('flex-row-reverse  max-w-[116px]', {
                '!w-[113px]': isLoggedIn && isTablet
              })}
              size="sm"
            >
              {isLoggedIn && userMenuProps?.username
                ? userMenuProps.username
                : literals.loginLabel}
            </Button>
            <UserMenu {...userMenuProps} />
          </div>
          <div className="relative flex items-center">
            {Boolean(cartQuantity) && (
              <CartIndicator
                quantity={cartQuantity}
                className="absolute top-[calc(50%-18px/2+1px)] -translate-x-1/2 z-10"
              />
            )}

            {/* MOBILE & TABLET */}
            <button
              className={classnames('p-1 desktop:hidden', {
                'animation-pulse': runAnimation
              })}
              onAnimationEnd={onAnimationEnd}
              onClick={onClickCart}
            >
              <Icon
                name="shopping_cart"
                className="desktop:hidden fill-current"
                width={isMobile ? 24 : 28}
                height={isMobile ? 24 : 28}
                color="white"
                data-testid="icon-shopping_cart-mobile"
              />
            </button>

            {/* DESKTOP */}
            <Button
              className={classnames('hidden desktop:flex', {
                'animation-pulse': runAnimation
              })}
              onClick={onClickCart}
              variant="tertiary"
              iconName="shopping_cart"
              size="sm"
            />
          </div>
        </div>
      </div>
    );
  }
);

UserNavbar.displayName = 'UserNavbar';
export default UserNavbar;
