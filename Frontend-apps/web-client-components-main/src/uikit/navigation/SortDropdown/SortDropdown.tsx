import React, { useState, type FC, useEffect } from 'react';
import { OptionRadio } from '../../input';
import classNames from 'classnames';
import { Icon } from '../../feedback';

export interface SortDropdownProps {
  sortList: Array<{
    label: string;
    value: string;
  }>;
  selectedValue?: string;
  onSelect: (option: string) => void;
  'data-testid'?: string;
}
const SortDropdown: FC<SortDropdownProps> = ({
  'data-testid': dataTestId = 'adelco-sort-dropdown',
  sortList,
  selectedValue,
  onSelect
}) => {
  const [open, setOpen] = useState(false);
  const [buttonLabel, setButtonLabel] = useState('Ordernar');

  const toggle = (): void => {
    setOpen(!open);
  };

  const handleOnChange = (value: string): void => {
    onSelect(value);
  };

  useEffect(() => {
    const item = sortList.find((item) => item.value === selectedValue);
    if (item) {
      setButtonLabel(item.label);
    }
    setOpen(false);
  }, [selectedValue]);

  return (
    <div
      className={classNames(
        'bg-white rounded-2xl transition-all overflow-hidden w-[258px]',
        {
          'shadow-card': !open,
          'drop-shadow-lg max-h-[500vh]': open,
          'max-h-[51px]': !open
        }
      )}
      data-testid={dataTestId}
    >
      <div
        className="p-4 text-sm bold flex justify-between cursor-pointer"
        onClick={toggle}
      >
        {buttonLabel}
        <span
          className={classNames('transition-transform', { 'rotate-180': open })}
        >
          <Icon name="arrow_s_down" />
        </span>
      </div>
      <ul className="flex flex-col gap-2 p-4">
        {sortList.map((option) => (
          <li key={option.value}>
            <OptionRadio
              onChange={(e) => {
                handleOnChange(e.target.value);
              }}
              className="!w-full text-xs"
              label={option.label}
              value={option.value}
              checked={option.value === selectedValue}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SortDropdown;
