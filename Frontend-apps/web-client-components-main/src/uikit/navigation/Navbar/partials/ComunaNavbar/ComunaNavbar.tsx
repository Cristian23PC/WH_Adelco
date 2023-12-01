import React, { type FC } from 'react';
import classnames from 'classnames';
import { Icon } from '../../../../feedback/Icon';
import { type ScreenSize } from '../../../../../utils/hooks/useScreen';

export interface ComunaNavbarProps {
  className?: string;
  zoneLabel?: string;
  onClickAddress?: VoidFunction;
  isLoggedIn: boolean;
  showTooltip?: boolean;
  screenSize: ScreenSize;
}

const ComunaNavbar: FC<ComunaNavbarProps> = ({
  className,
  zoneLabel,
  onClickAddress,
  isLoggedIn,
  showTooltip = false,
  screenSize: { isDesktop }
}) => {
  const handleClick = (): void => {
    if (isLoggedIn) {
      onClickAddress?.();
    }
  };

  return (
    <div
      className={classnames(
        'relative flex items-center py-2 px-4 tablet:px-6 desktop:p-0 gap-1',
        className,
        isLoggedIn && 'cursor-pointer'
      )}
      onClick={handleClick}
    >
      {zoneLabel && (
        <>
          <Icon
            name="place"
            className={classnames('min-w-[15px]', {
              'fill-moon': !isDesktop,
              'fill-white': isDesktop
            })}
            width={15}
            height={15}
          />
          <span
            data-testid="zone-label"
            className="text-white text-xs w-auto tablet:w-fit desktop:w-auto text-overflow-ellipsis line-clamp-1 tablet:line-clamp-2"
          >
            {zoneLabel}
          </span>
        </>
      )}
    </div>
  );
};

export default ComunaNavbar;
