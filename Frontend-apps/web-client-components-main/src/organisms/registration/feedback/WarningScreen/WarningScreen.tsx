import React, { type ReactNode, type FC } from 'react';
import classNames from 'classnames';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import { Icon } from '../../../../uikit/feedback/Icon';

export interface WarningScreenProps {
  'data-testid'?: string;
  variant: 'done' | 'error';
  title: ReactNode;
  children?: ReactNode;
}
const WarningScreen: FC<WarningScreenProps> = ({
  'data-testid': dataTestId = 'warning-screen',
  variant,
  title,
  children
}) => {
  const { isMobile } = useScreen();

  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'flex flex-col items-center mt-20',
        'font-sans text-xs text-center px-4 pb-4',
        'gap-8'
      )}
    >
      <Icon
        name={variant}
        className="fill-corporative-01"
        width={isMobile ? 50 : 60}
        height={isMobile ? 50 : 60}
      />
      <p className={classNames('text-base font-semibold tablet:w-[300px]')}>
        {title}
      </p>
      {children}
    </div>
  );
};

export default WarningScreen;
