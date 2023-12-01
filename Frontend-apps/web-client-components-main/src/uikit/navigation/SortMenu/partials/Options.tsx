import React, { type FC } from 'react';
import { OptionRadio } from '../../../input';
import { type Option } from '../types';
interface OptionsProps {
  sortList: Option[];
  selectedValue?: string;
  onSelect: (value: string) => void;
}
const Options: FC<OptionsProps> = ({ sortList, selectedValue, onSelect }) => {
  const handleOptionChange = (value: string): void => {
    onSelect(value);
  };
  return (
    <div className="flex flex-col gap-y-2">
      {sortList.map((option: Option, index: number) => (
        <OptionRadio
          onChange={() => {
            handleOptionChange(option.value);
          }}
          className="w-full"
          key={index}
          value={option.value}
          checked={option.value === selectedValue}
          label={option.label}
        />
      ))}
    </div>
  );
};
export default Options;
