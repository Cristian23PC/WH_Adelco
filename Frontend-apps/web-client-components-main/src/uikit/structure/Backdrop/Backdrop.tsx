import React from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

export interface BackdropProps {
  'data-testid'?: string;
  className?: string;
  onClick?: VoidFunction;
  show?: boolean;
  disableTransition?: boolean;
}

const Backdrop: React.FC<BackdropProps> = ({
  'data-testid': dataTestId = 'adelco-backdrop',
  className,
  onClick,
  show,
  disableTransition = false
}) => {
  return (
    <CSSTransition
      in={show}
      timeout={disableTransition ? 0 : 200}
      classNames="backdrop"
      unmountOnExit
    >
      <div
        data-testid={dataTestId}
        className={classNames(
          'fixed left-0 top-0',
          'w-full h-full',
          'bg-backdrop',
          'backdrop-blur-[15px]',
          'z-20',
          className
        )}
        onClick={onClick}
      />
    </CSSTransition>
  );
};

export default Backdrop;
