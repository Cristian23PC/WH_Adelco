import React, { type FC, type ReactNode } from 'react';
import classNames from 'classnames';

export interface ModalBodyProps {
  children?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

const ModalBody: FC<ModalBodyProps> = ({
  children,
  className,
  'data-testid': dataTestId = 'adelco-modal-body'
}) => {
  return (
    <div
      className={classNames(
        'flex justify-center font-sans text-base text-corporative-03 text-center',
        className
      )}
      data-testid={dataTestId}
    >
      {children}
    </div>
  );
};

export default ModalBody;
