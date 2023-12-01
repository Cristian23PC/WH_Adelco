import React, { type FC, useState, useRef, useEffect } from 'react';
import { TextField } from '../TextField';
import { OptionCheck } from '../OptionCheck';
import { Accordion } from '../../structure';
import classNames from 'classnames';
import useClickOutside from '../../../utils/hooks/useClickOutside';
import { type IconName } from '../../../utils/types';
import { type Variants } from '../TextField/utils';
import { InputMessage } from '../../feedback/InputMessage';

export const DEFAULT_LITERALS = {
  notFoundLabel: 'Sin datos para tu busqueda'
};

export interface OptionObject {
  label: string;
  value: string;
}
export interface DropdownMultiselectProps {
  title: string;
  placeholder?: string;
  options: OptionObject[];
  value?: string[];
  onChange: (value: string[]) => void;
  onSearch?: (term: string) => void;
  isSearchable?: boolean;
  isLoading?: boolean;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  helperText?: string;
  helperIcon?: IconName;
  variant?: Variants;
}

const DropdownMultiselect: FC<DropdownMultiselectProps> = ({
  title,
  placeholder,
  options,
  value,
  onChange,
  onSearch,
  isLoading = false,
  isSearchable,
  literals = {},
  helperText,
  helperIcon,
  variant = 'none'
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const [searchTerm, setSearchedTerm] = useState<string>('');
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const optionsRef = useRef(null);

  const currentValues = value ?? selectedValues;

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setSearchedTerm('');
      }, 150);
    }
  }, [isOpen]);

  const handleToggle = (): void => {
    setIsOpen((prevState) => !prevState);
  };

  useClickOutside([optionsRef, buttonRef], handleToggle, isOpen);

  const handleOnSearch = (value: string): void => {
    setSearchedTerm(value);
    onSearch?.(value);
  };

  const handleClearSearch = (): void => {
    if (searchTerm) {
      handleOnSearch('');
    }
  };

  const handleOnChange = (item: OptionObject): void => {
    setSelectedValues((prevState) => {
      const currentValues = value ?? prevState;
      let newValue = [];
      if (currentValues.includes(item.value)) {
        newValue = currentValues.filter((value) => value !== item.value);
      } else {
        newValue = [...currentValues, item.value];
      }

      onChange(newValue);
      return newValue;
    });
  };

  const isOptionActive = (value: string): boolean =>
    currentValues.includes(value);

  const isOptionSearched = (label: string): boolean =>
    label.toLowerCase().includes(searchTerm.toLowerCase());

  const filteredOptions = options.filter(
    ({ label, value }) => isOptionSearched(label) || isOptionActive(value)
  );

  const showNotFound = filteredOptions.length === 0 && searchTerm;

  return (
    <Accordion
      title={title}
      open={isOpen}
      onClick={handleToggle}
      className={classNames(
        'relative overflow-visible [&>div]:desktop:text-sm [&>div:first-child]:border-[1px]',
        {
          '[&>div:first-child]:font-bold': currentValues.length || isOpen,
          '[&>div:first-child]:border-snow ': !variant || variant === 'none',
          '[&>div:first-child]:border-failure': variant === 'failure',
          '[&>div:first-child]:border-warning': variant === 'warning',
          '[&>div:first-child]:border-success': variant === 'success'
        }
      )}
      ref={buttonRef}
    >
      <InputMessage variant={variant} iconName={helperIcon}>
        {helperText}
      </InputMessage>
      <div
        className={classNames(
          'flex flex-col gap-4 mt-2 text-left bg-white rounded-md drop-shadow-md transition-all min-w-full w-[222px]',
          'absolute left-1/2 translate-x-[-50%] z-50 overflow-y-auto',
          {
            'max-h-0': !isOpen,
            'max-h-[400px]': isOpen
          }
        )}
        ref={optionsRef}
      >
        {isSearchable && (
          <div
            className={classNames(
              'm-3 mb-0',
              '[&_input]:pr-9',
              '[&_svg]:w-6 [&_svg]:h-6 [&_svg]:right-2 [&_svg]:top-1/2 [&_svg]:translate-y-[-50%]'
            )}
          >
            <TextField
              iconName={isLoading ? 'spinner' : searchTerm ? 'close' : 'search'}
              value={searchTerm}
              placeholder={placeholder}
              onChange={(e) => {
                handleOnSearch(e.target.value);
              }}
              onClickIcon={handleClearSearch}
              isDropdownSearchable
            />
          </div>
        )}
        <ul
          className={classNames(
            'w-full grid gap-2 h-auto max-h-64 scroll-smooth scrollbar-thin overflow-y-auto p-3',
            {
              'pt-0': isSearchable
            }
          )}
        >
          {showNotFound && (
            <p className="text-sm font-sans p-4 tablet:p-2">
              {l.notFoundLabel}
            </p>
          )}
          {filteredOptions.map((item: OptionObject) => {
            const isActive = isOptionActive(item.value);
            return (
              <OptionCheck
                className={classNames('tablet:w-auto w-auto', {
                  'order-0': isActive,
                  'order-1': !isActive
                })}
                checked={isActive}
                key={item.value}
                label={item.label}
                onChange={() => {
                  handleOnChange(item);
                }}
              />
            );
          })}
        </ul>
      </div>
    </Accordion>
  );
};

export default DropdownMultiselect;
