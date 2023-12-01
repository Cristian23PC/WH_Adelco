import React, { type FC } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';
import { Logo } from '../../../foundation/Logo';
import useScreen, {
  type ScreenSize
} from '../../../utils/hooks/useScreen/useScreen';

const getIconSize = (screen: ScreenSize): number => {
  if (screen.isDesktop) return 80;
  if (screen.isTablet) return 64;
  return 50;
};

type Range_1_100 = '100' | `${Range_1_99}`;
type Range_1_99 = `${Range_1_9}${Range_0_9}` | Range_0_9;
type Range_0_9 = '0' | Range_1_9;
type Range_1_9 = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export interface SpinnerProps {
  'data-testid'?: string;
  backdropColor?: 'white' | 'black';
  opacity?: Range_1_100;
  className?: string;
  backdropClassName?: string;
}

const Spinner: FC<SpinnerProps> = ({
  'data-testid': dataTestId = 'adelco-spinner',
  backdropColor = 'white',
  opacity = '50',
  className,
  backdropClassName
}) => {
  const { isMobile, isTablet, isDesktop } = useScreen();
  const iconSize = getIconSize({ isMobile, isTablet, isDesktop });
  const backdropColorClass =
    backdropColor === 'white' ? 'bg-white' : 'bg-black';
  const logoVariant =
    backdropColor === 'white' ? 'corporative-isotype' : 'white-isotype';

  return (
    <>
      <div
        data-testid="adelco-spinner-backdrop"
        style={{ opacity: Number(opacity.padStart(3, '0')) / 100 }}
        className={classNames(
          'absolute top-0 right-0 flex items-center justify-center h-screen w-screen z-100',
          backdropColorClass,
          backdropClassName
        )}
      />
      <div
        data-testid={dataTestId}
        className={classNames(
          'absolute top-0 right-0  flex items-center justify-center h-screen w-screen z-100',
          className
        )}
      >
        <div className="flex items-center justify-center">
          <Icon
            name="spinner"
            width={iconSize}
            height={iconSize}
            className="fill-corporative-01-hover"
          />
          <Logo
            variant={logoVariant}
            width={isMobile ? 16 : 24}
            height={isMobile ? 16 : 24}
            className="absolute"
          />
        </div>
      </div>
    </>
  );
};

export default Spinner;
