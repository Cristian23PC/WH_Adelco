import React, { type FC, type ReactNode } from 'react';
import classNames from 'classnames';
import { Icon } from '../Icon';
import { Logo } from '../../../foundation/Logo';

export interface ModalHeaderProps {
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
  onClose?: () => void;
  showLogo: boolean;
  showClose?: boolean;
}

const ModalHeader: FC<ModalHeaderProps> = ({
  children,
  className,
  'data-testid': dataTestId = 'adelco-modal-header',
  onClose,
  showLogo,
  showClose = 'true'
}) => {
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'w-100% text-center font-semibold text-base',
        { 'pb-4': children != null },
        className
      )}
    >
      <div className="flex justify-end h-[30px]">
        {showClose && (
          <Icon name="close" onClick={onClose} width={30} height={30} />
        )}
      </div>

      {showLogo && (
        <div className="flex flex-col gap-4 tablet:gap-8 items-center pb-12 tablet:pb-8">
          <Icon
            name="sentiment_satisfied"
            width={50}
            height={50}
            className="fill-corporative-01"
          />
          <Logo width={120} />
        </div>
      )}
      {children != null && <div>{children}</div>}
    </div>
  );
};

export default ModalHeader;
