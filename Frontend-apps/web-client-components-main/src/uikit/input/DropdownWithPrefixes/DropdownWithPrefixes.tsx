import React, { type FC } from 'react';
import * as flagNames from '../../feedback/Flag/flagNames';
import { Flag } from '../../feedback';
import Dropdown, { type DropdownProps } from '../Dropdown/Dropdown';
import { type FlagName } from '../../../utils/types';

const PREFIX: Record<FlagName, string> = {
  [flagNames.AR]: '54',
  [flagNames.BR]: '55',
  [flagNames.CL]: '56',
  [flagNames.CO]: '57',
  [flagNames.EC]: '593',
  [flagNames.MX]: '52',
  [flagNames.PE]: '51',
  [flagNames.US]: '1',
  [flagNames.VZ]: '58'
};

const options = [
  {
    label: (
      <span className="flex gap-1 items-center">
        <Flag name={flagNames.CL} width={15} height={15} className="shrink-0" />
        {`+${PREFIX[flagNames.CL]}`}
      </span>
    ),
    value: PREFIX[flagNames.CL]
  }
];

const DropdownWithPrefixes: FC<Omit<DropdownProps, 'options'>> = (props) => {
  return <Dropdown {...props} options={options} inputClassName="font-normal" />;
};

export default DropdownWithPrefixes;
