import React, {
  useEffect,
  type ReactNode,
  useRef,
  type CSSProperties
} from 'react';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { Backdrop } from '../../structure/Backdrop';
import ModalHeader from './ModalHeader';
import ModalBody from './ModalBody';

export interface ModalProps {
  'data-testid'?: string;
  open?: boolean;
  onClose: () => void;
  showClose?: boolean;
  className?: string;
  backdropClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  showLogo?: boolean;
  title?: string;
  children?: ReactNode;
  id?: string;
  style?: CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  'data-testid': dataTestId = 'adelco-modal',
  open = false,
  onClose,
  showClose = true,
  className,
  backdropClassName,
  headerClassName,
  bodyClassName,
  showLogo = false,
  title,
  children,
  id = 'default',
  style
}) => {
  const modalContentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: Event): void => {
      const target = event.target as Node;
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  useEffect(() => {
    changeBodyScroll(open);

    return () => {
      open && changeBodyScroll(false);
    };
  }, [open]);

  const changeBodyScroll = (disable: boolean): void => {
    document.body.classList.toggle(`modal-open-${id}`, disable);
  };

  return (
    <>
      <CSSTransition in={open} timeout={200} classNames="modal" unmountOnExit>
        <div className="w-full fixed z-50 top-0 bottom-0 left-0 right-0 overflow-y-auto scroll-smooth scrollbar-thin">
          <div className="absolute flex justify-center items-center z-50 top-0 left-0 w-full h-auto min-h-full py-4">
            <div
              ref={modalContentRef}
              data-testid={dataTestId}
              className={classnames(
                'relative bg-white shadow-xl z-50',
                'w-screen tablet:w-[474px] desktop:w-[500px] max-w-[calc(100vw-32px)]',
                'px-4 pt-4 pb-10',
                'rounded-[16px] font-sans text-corporative-03',
                className
              )}
              style={style}
            >
              <ModalHeader
                className={headerClassName}
                onClose={onClose}
                showLogo={showLogo}
                showClose={showClose}
              >
                {title}
              </ModalHeader>
              <ModalBody className={classnames(bodyClassName, 'px-0')}>
                {children}
              </ModalBody>
            </div>
          </div>
        </div>
      </CSSTransition>
      <Backdrop show={open} className={classnames(backdropClassName, 'z-40')} />
    </>
  );
};

export default Modal;
