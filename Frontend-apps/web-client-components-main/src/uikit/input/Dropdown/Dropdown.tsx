import React, {
  useState,
  useEffect,
  useRef,
  type FC,
  type ReactNode
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { useFloating, shift, offset, flip } from '@floating-ui/react-dom';
import classNames from 'classnames';
import { Icon } from '../../feedback';
import Option from './partials/Option';
import useScreen, {
  type ScreenSize
} from '../../../utils/hooks/useScreen/useScreen';
import type IconName from '../../../utils/types/IconName.type';
import { type Variants } from '../TextField/utils';
import { InputMessage } from '../../feedback/InputMessage';
export interface OptionObject {
  label: string | ReactNode;
  value: string;
}

export interface DropdownProps {
  'data-testid'?: string;
  className?: string;
  inputClassName?: string;
  label?: string;
  value?: string;
  options: OptionObject[];
  disabled?: boolean;
  onChange?: (option: string) => void;
  maxOptions?: number;
  isOpen?: boolean;
  onOpen?: VoidFunction;
  helperText?: string;
  helperIcon?: IconName;
  variant?: Variants;
}

const getMaxHeight = (options: number, screenSize: ScreenSize): number => {
  const mobileHeight = 52;
  const tabletHeight = 32;
  return screenSize.isMobile ? options * mobileHeight : options * tabletHeight;
};

const Dropdown: FC<DropdownProps> = ({
  'data-testid': dataTestId = 'adelco-dropdown',
  className,
  inputClassName,
  label,
  value,
  options,
  onChange = () => {},
  disabled = false,
  maxOptions = 6,
  isOpen = false,
  onOpen = () => {},
  helperText,
  helperIcon,
  variant = 'none'
}) => {
  const { x, y, reference, floating } = useFloating({
    placement: 'bottom',
    middleware: [
      offset({ crossAxis: 0, mainAxis: 8 }),
      flip(),
      shift({ padding: 5 })
    ]
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const screenSize = useScreen();
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: Event): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClick = (): void => {
    if (!disabled) {
      setOpen(!open);
      if (!open) {
        onOpen();
      }
    }
  };

  const handleOptionClick = (value: string): void => {
    setOpen(false);
    onChange(value);
  };

  const heightStyle = {
    maxHeight: `${getMaxHeight(maxOptions, screenSize)}px`
  };

  const displayLabel =
    value != null ? options.find((opt) => opt.value === value)?.label : label;

  return (
    <div
      data-testid={dataTestId}
      className={classNames('relative min-w-[200px]', className)}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={classNames(
          'flex items-center gap-2 tablet:gap-4 w-full',
          'bg-snow py-2 px-4 leading-[19px]',
          'border-[1px] rounded-md',
          'outline outline-0 focus:outline-0',
          'text-sm text-left',
          inputClassName,
          {
            'shadow-lg': open,
            'font-bold': value,
            'opacity-30': disabled,
            'border-snow ': !variant || variant === 'none',
            'border-failure': variant === 'failure',
            'border-warning': variant === 'warning',
            'border-success': variant === 'success'
          }
        )}
        onClick={handleClick}
        disabled={disabled}
        ref={reference}
      >
        <span className="truncate grow">{displayLabel ?? label}</span>
        <span
          className={classNames(
            'transition-all origin-center',
            open ? 'rotate-180' : 'rotate-0'
          )}
        >
          <Icon name="arrow_s_down" width={32} height={32} />
        </span>
      </button>
      <InputMessage variant={variant} iconName={helperIcon}>
        {helperText}
      </InputMessage>
      <CSSTransition
        in={open}
        timeout={200}
        classNames="dropdown"
        unmountOnExit
      >
        <ul
          ref={floating}
          data-testid="adelco-dropdown-options"
          className={classNames(
            'absolute',
            'w-full bg-white p-0',
            'rounded-md drop-shadow-md',
            'z-50 overflow-y-auto',
            'scroll-smooth scrollbar-thin'
          )}
          style={
            y != null && x != null
              ? { top: y, left: x, ...heightStyle }
              : { ...heightStyle }
          }
        >
          {options.map((opt, index) => (
            <Option
              key={opt.value}
              data-testid={`adelco-dropdown-option-${index}`}
              onClick={() => {
                handleOptionClick(opt.value);
              }}
              isSelected={value === opt.value}
            >
              {opt.label}
            </Option>
          ))}
        </ul>
      </CSSTransition>
    </div>
  );
};

export default Dropdown;
