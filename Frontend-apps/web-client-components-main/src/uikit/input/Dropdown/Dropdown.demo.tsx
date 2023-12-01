import React, { useState, type FC } from 'react';
import Dropdown, { type DropdownProps } from './Dropdown';

const DropdownDemo: FC<DropdownProps> = ({ value, ...rest }) => {
  const [optionSelected, setOptionSelected] = useState<any>(value);

  const onChange = (option: string): void => {
    setOptionSelected(option);
    console.log('Option: ', option);
  };
  return <Dropdown {...rest} value={optionSelected} onChange={onChange} />;
};

export default DropdownDemo;
