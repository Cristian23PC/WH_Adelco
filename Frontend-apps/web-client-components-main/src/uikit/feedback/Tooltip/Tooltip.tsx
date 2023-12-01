import React, { useState, type ReactNode } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

export interface TooltipProps {
  text: string;
  children: ReactNode;
  open?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  open,
  position = 'top',
  className
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseOver={() => {
        open ?? setShow(true);
      }}
      onMouseLeave={() => {
        open ?? setShow(false);
      }}
    >
      <CSSTransition
        in={open ?? show}
        timeout={200}
        unmountOnExit
        classNames="tooltip"
      >
        <span
          className={classNames(
            'absolute z-10',
            'w-48 p-1',
            'bg-corporative-03 rounded-[4px] text-center text-white text-xs font-semibold',
            "after:content-[''] after:absolute after:border-[9px] after:border-transparent",
            {
              'left-1/2 -translate-x-1/2 after:left-1/2 after:-translate-x-1/2':
                position === 'top' || position === 'bottom',
              'top-1/2 -translate-y-1/2 after:top-1/2 after:-translate-y-1/2':
                position === 'left' || position === 'right',
              '-top-2 -translate-y-full after:top-full after:border-t-corporative-03 after:-translate-y-[1px]':
                position === 'top',
              '-bottom-2 translate-y-full after:bottom-full after:border-b-corporative-03 after:translate-y-[1px]':
                position === 'bottom',
              '-left-2 -translate-x-full after:left-full after:border-l-corporative-03 after:-translate-x-[1px]':
                position === 'left',
              '-right-2 translate-x-full after:right-full after:border-r-corporative-03 after:translate-x-[1px]':
                position === 'right'
            },
            className
          )}
        >
          {text}
        </span>
      </CSSTransition>

      {children}
    </div>
  );
};
