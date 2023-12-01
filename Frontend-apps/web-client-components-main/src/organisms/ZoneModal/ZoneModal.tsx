import React, { type FC } from 'react';
import ZoneModalContent, {
  type Values,
  type DEFAULT_LITERALS
} from './partials';
import type { OptionObject } from '../../uikit/input/Dropdown/Dropdown';

export interface Props {
  open: boolean;
  onClose: VoidFunction;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onSubmit: (values: Values) => void;
  onRegionChange: (value: string) => void;
  onCommuneChange?: (value: string) => void;
  onLocalityChange?: (value: string) => void;
  regionOptions: OptionObject[];
  communeOptions?: OptionObject[];
  localityOptions?: OptionObject[];
  values?: Values;
  isValid?: boolean;
  isLoading?: boolean;
  onLoginClick?: () => void;
}

const ZoneModal: FC<Props> = ({
  open,
  onClose,
  literals,
  onSubmit,
  onRegionChange,
  onCommuneChange,
  onLocalityChange,
  regionOptions,
  communeOptions,
  localityOptions,
  values,
  isValid = true,
  isLoading = false,
  onLoginClick
}) => {
  return (
    <ZoneModalContent
      onClose={onClose}
      open={open}
      regionOptions={regionOptions}
      literals={literals}
      onRegionChange={onRegionChange}
      onCommuneChange={onCommuneChange}
      onLocalityChange={onLocalityChange}
      values={values}
      communeOptions={communeOptions}
      localityOptions={localityOptions}
      onSubmit={onSubmit}
      isValid={isValid}
      isLoading={isLoading}
      onLoginClick={onLoginClick}
    />
  );
};

export default ZoneModal;
