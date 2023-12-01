import React, { useRef, type FC } from 'react';
import { type LinkRenderer } from '../../../../../../utils/types';
import { type MenuItem } from './types';
import useClickOutside from '../../../../../../utils/hooks/useClickOutside';
import classNames from 'classnames';

export interface UserMenuProps {
  additionalOptions?: MenuItem[];
  open: boolean;
  linkRenderer: LinkRenderer;
  'data-testid'?: string;
  username?: string;
  onClickMyAccount: VoidFunction;
  onLogout: VoidFunction;
  onClose: VoidFunction;
}

const UserMenu: FC<UserMenuProps> = ({
  'data-testid': testId = 'user-menu',
  open = false,
  additionalOptions,
  linkRenderer,
  onClickMyAccount,
  onLogout,
  onClose
}) => {
  const menuRef = useRef(null);
  useClickOutside(menuRef, onClose, open);

  const DEFAULT_LITERALS = {
    myAccount: 'Mi cuenta',
    logout: 'Cerrar sesión'
  };

  return (
    <div
      ref={menuRef}
      data-testid={testId}
      className={classNames(
        open ? 'block' : 'hidden',
        'z-90 absolute top-[48px] bg-white',
        'w-screen left-0 tablet:w-[200px]',
        'tablet:top-[50px] desktop:top-[58px]',
        'tablet:-left-[85px] desktop:-left-[82px]',
        'p-4 tablet:p-2 desktop:p-4',
        'rounded-b-2xl'
      )}
    >
      <ul
        className={classNames(
          'flex flex-col gap-2 font-sans text-corporative-02',
          'text-sm tablet:text-xs desktop:text-sm'
        )}
      >
        {/* // Task FP:4498 - Option temporarily removed as there is no My Account options for user
          <li
          className="p-4 shadow-list hover:cursor-pointer"
          onClick={() => {
            onClickMyAccount();
            onClose();
          }}
        >
          {DEFAULT_LITERALS.myAccount}
        </li> */}
        {additionalOptions?.map((item: MenuItem) => (
          <li
            className="p-4 shadow-list hover:cursor-pointer"
            key={item.value}
            onClick={() => {
              item.onClick?.();
              onClose();
            }}
          >
            {item.path && linkRenderer(item.path, <a>{item.label}</a>)}
            {!item.path && <span>{item.label}</span>}
          </li>
        ))}
        <li
          className="p-4 hover:cursor-pointer"
          onClick={() => {
            onLogout();
            onClose();
          }}
        >
          {DEFAULT_LITERALS.logout}
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
