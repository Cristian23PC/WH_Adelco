import React, { useEffect, useState } from 'react';
import { Icon } from '../../feedback/Icon';
import { type IconName } from '../../../utils/types';
import classNames from 'classnames';

export interface MenuItemProps {
  'data-testid'?: string;
  label: string;
  active: boolean;
  iconName: IconName;
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
}

export const MenuItem: React.FC<MenuItemProps> = ({
  'data-testid': dataTestId = 'adelco-menu-item',
  label,
  active,
  iconName,
  className,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const hasOptions = !!children;

  useEffect(() => {
    hasOptions && setIsOpen(active);
  }, [active, hasOptions]);

  const handleToggleOpen = (): void => {
    hasOptions && !active && setIsOpen((prevValue) => !prevValue);
  };

  return (
    <div className={classNames('w-full')}>
      <div
        data-testid={dataTestId}
        className={classNames(
          'w-full h-[48px] rounded-2xl pointer-events-auto flex ring-1 ring-white items-center p-2 cursor-pointer',
          className,
          { 'bg-corporative-01-hover': active, 'bg-snow': !active }
        )}
        onClick={handleToggleOpen}
      >
        <div className="relative flex-1 w-0">
          <div className="relative flex items-center">
            <div
              className={classNames('flex-shrink-0 m-auto rounded-lg p-1', {
                'bg-corporative-01': active,
                'bg-white': !active
              })}
            >
              <Icon
                data-testid="adelco-menu-item-icon"
                width={24}
                height={24}
                name={iconName}
                color="black"
                className={classNames({
                  'fill-black': active,
                  'fill-corporative-01': !active
                })}
              />
            </div>
            <div className="ml-2 flex-1">
              <p
                className={classNames('font-body text-xs', {
                  'font-bold': active
                })}
              >
                {label}
              </p>
            </div>
          </div>
        </div>

        {hasOptions && (
          <Icon
            data-testid="adelco-menu-item-arrow-icon"
            width={24}
            height={24}
            name={isOpen ? 'arrow_s_up' : 'arrow_s_down'}
            color="black"
            className={classNames('fill-black')}
          />
        )}
      </div>

      {hasOptions && isOpen && (
        <div className={classNames('flex flex-col gap-y-2 px-4 py-2')}>
          {children}
        </div>
      )}
    </div>
  );
};

export default MenuItem;
