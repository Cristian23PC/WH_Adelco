import React, {
  type FC,
  useState,
  type ChangeEvent,
  useEffect,
  useRef
} from 'react';
import { TextField } from '../TextField';
import Option from '../Dropdown/partials/Option';
import useMenuItems from './useMenuItems';
import useMenuToggle from './useMenuToggle';
import useDebounce from '../../../utils/hooks/useDebounce';
import type IconName from '../../../utils/types/IconName.type';
import { type Variants } from '../TextField/utils';
import useClickOutside from '../../../utils/hooks/useClickOutside';

const MENU_ITEMS_GAP = 7;
export const DEFAULT_LITERALS = {
  notFoundLabel: 'Sin datos para tu búsqueda'
};

export interface OptionObject {
  label: string;
  value: string;
}
export interface DropdownSearchableProps {
  onChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  options: OptionObject[];
  maxOptions?: number;
  onSearch: (term: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  minLengthToSearch?: number;
  helperText?: string;
  helperIcon?: IconName;
  variant?: Variants;
}

const getLabelFromOptions = (
  options: OptionObject[],
  value: string
): string => {
  const foundOption = options.find((option) => option.value === value);
  return foundOption?.label ?? '';
};

const DropdownSearchable: FC<DropdownSearchableProps> = ({
  options,
  maxOptions = 6,
  onSearch,
  onChange,
  isLoading = false,
  value = '',
  placeholder,
  disabled = false,
  helperText,
  helperIcon,
  variant = 'none',
  minLengthToSearch = 1,
  literals = {}
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const wrapperRef = useRef(null);
  const [searchTerm, setSearchedTerm] = useState<string>(
    getLabelFromOptions(options, value)
  );
  const showNotFound = options.length === 0 && searchTerm;
  const {
    menuItemsRef,
    menuHeight,
    onCloseMenuItems,
    onOpenMenuItems,
    isMenuItemsOpen
  } = useMenuItems({
    maxOptions,
    itemsLength: showNotFound ? 1 : options.length
  });
  const { menuToggleRef, menuToggleHeight } = useMenuToggle();
  useClickOutside<HTMLElement>(
    [wrapperRef, menuItemsRef],
    onCloseMenuItems,
    isMenuItemsOpen
  );

  useEffect(() => {
    const label = getLabelFromOptions(options, value);
    if (label) {
      setSearchedTerm(label);
    }
    if (options.length === 0) {
      onChange('');
      onSearch('');
    }
  }, [value]);

  const debouncedSearch = useDebounce({ fn: onSearch });

  const handleOnSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    setSearchedTerm(value);
    const minLength = minLengthToSearch >= 1 ? minLengthToSearch : 1;
    if (value.length >= minLength || value.length === 0) {
      debouncedSearch(value);
    }

    if (value.length === 0) onChange('');
  };

  const handleOnChange = (item: OptionObject): void => {
    if (item.value !== value) {
      setSearchedTerm(item.label);
      onChange(item.value);
      onSearch(item.label);
    }
  };

  const handleClickIcon = (): void => {
    if (isMenuItemsOpen) {
      onCloseMenuItems();
    } else {
      onOpenMenuItems();
    }

    if (searchTerm) {
      setSearchedTerm('');
      onChange('');
      onSearch('');
    }
  };

  return (
    <div className="relative text-left" ref={wrapperRef}>
      <TextField
        ref={menuToggleRef}
        iconName={isLoading ? 'spinner' : searchTerm ? 'close' : 'search'}
        onFocus={onOpenMenuItems}
        onBlur={onCloseMenuItems}
        value={isLoading ? '' : searchTerm}
        placeholder={isLoading ? '' : placeholder}
        onChange={handleOnSearch}
        onClickIcon={handleClickIcon}
        disabled={disabled}
        isDropdownSearchable={true}
        helperIcon={helperIcon}
        helperText={helperText}
        variant={variant}
      />
      <ul
        ref={menuItemsRef}
        style={{ top: menuToggleHeight + MENU_ITEMS_GAP, height: menuHeight }}
        className={`absolute w-full overflow-y-auto z-10 ${
          isMenuItemsOpen ? 'block transform h-auto' : 'hidden transform h-0'
        } transition-all duration-300 ease-in-out scroll-smooth scrollbar-thin`}
      >
        {showNotFound && !isLoading && <Option>{l.notFoundLabel}</Option>}
        {options.map((option, key) => (
          <Option
            onClick={() => {
              handleOnChange(option);
            }}
            key={key}
            isSelected={value === option.value}
          >
            {option.label}
          </Option>
        ))}
      </ul>
    </div>
  );
};

DropdownSearchable.displayName = 'DropdownSearchable';

export default DropdownSearchable;
