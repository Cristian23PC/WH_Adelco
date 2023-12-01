import React, { type ReactNode, type FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Backdrop } from '../Backdrop';
import { CSSTransition } from 'react-transition-group';
import useScreen from '../../../utils/hooks/useScreen';

export interface OffCanvasProps {
  'data-testid'?: string;
  show: boolean;
  placement?: 'left' | 'right';
  className?: string;
  backdropClassName?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  onClose?: VoidFunction;
  isChild?: boolean;
}
const OffCanvas: FC<OffCanvasProps> = ({
  'data-testid': dataTestId = 'adelco-offcanvas',
  show,
  children,
  backdropClassName,
  className,
  onClose,
  isChild = false,
  placement = 'left',
  style
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isDesktop } = useScreen();
  const position = {
    left: isChild ? 'left-0 tablet:left-[258px]' : 'left-0',
    right: isChild ? 'right-0 tablet:right-[300px]' : 'right-0'
  };

  const border = {
    left: 'border-r',
    right: 'border-l'
  };

  const shadow = {
    left: 'drop-shadow-sm-right',
    right: 'drop-shadow-sm-left'
  };

  const size = {
    left: 'w-[279px] tablet:w-[258px]',
    right: 'w-[286px] tablet:w-[300px]'
  };

  const changeBodyScroll = (disable: boolean): void => {
    if (!isChild) {
      document.body.classList.toggle('off-canvas-open', disable);
    }
  };

  useEffect(() => {
    setIsOpen((isCurrentOpen) => {
      if (show) {
        changeBodyScroll(true);
      } else if (isCurrentOpen) {
        changeBodyScroll(false);
      }

      return show;
    });
  }, [show]);

  useEffect(() => {
    return () => {
      isOpen && changeBodyScroll(false);
    };
  }, [isOpen]);

  return (
    <>
      {!isChild && (
        <Backdrop
          className={classNames('z-50 desktop:opacity-0', backdropClassName)}
          show={show}
          onClick={onClose}
          disableTransition={isDesktop}
        />
      )}
      <CSSTransition
        in={show}
        timeout={200}
        classNames={{
          enter: `offcanvas-enter-${placement}`,
          enterActive: 'offcanvas-enter-active',
          exit: `offcanvas-exit-${placement}`,
          exitActive: `offcanvas-exit-active-${placement}`
        }}
        unmountOnExit
      >
        <div
          className={classNames(
            'z-60 fixed top-0 bottom-0 h-auto bg-white whitespace-nowrap',
            position[placement],
            size[placement],
            border[placement],
            shadow[placement],
            className
          )}
          style={style}
          data-testid={dataTestId}
        >
          {children}
        </div>
      </CSSTransition>
    </>
  );
};

export default OffCanvas;
