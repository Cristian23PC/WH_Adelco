import React from 'react';
import classNames from 'classnames';

export interface MenuItemOptionProps {
  'data-testid'?: string;
  label: string;
  active: boolean;
  className?: string;
  onClick?: () => void;
}

export const MenuItemOption: React.FC<MenuItemOptionProps> = ({
  'data-testid': dataTestId = 'adelco-menu-item-option',
  label,
  className,
  active,
  onClick
}) => {
  return (
    <div
      className={classNames('p-4 rounded-lg cursor-pointer', className, {
        'border-2 border-corporative-01-hover': active,
        'border-[1px] border-snow': !active
      })}
      data-testid={dataTestId}
      onClick={onClick}
    >
      <p
        className={classNames('font-body text-xs', {
          'font-bold': active,
          'p-px': !active
        })}
      >
        {label}
      </p>
    </div>
  );
};

export default MenuItemOption;
