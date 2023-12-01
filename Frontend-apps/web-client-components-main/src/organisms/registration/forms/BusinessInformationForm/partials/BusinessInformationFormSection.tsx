import React, { useEffect, type FC } from 'react';
import { TextField } from '../../../../../uikit/input';
import { handleErrors } from './utils';
import { useFormContext } from 'react-hook-form';
import { type FormValues } from '../types';

export const DEFAULT_LITERALS = {
  firstSectionTitle: 'Información de negocio',
  RUTLabel: 'RUT de empresa',
  socialReasonLabel: 'Razón social',
  localNameLabel: 'Nombre de tu local'
};

interface BusinessInformationFormProps {
  RUT: string;
  socialReason: string;
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
  hideSocialReason: boolean;
}
const BusinessInformationFormSection: FC<BusinessInformationFormProps> = ({
  RUT,
  socialReason,
  literals,
  hideSocialReason
}) => {
  const {
    setValue,
    register,
    formState: { errors }
  } = useFormContext<FormValues>();

  useEffect(() => {
    setValue('RUT', RUT);
    setValue('socialReason', socialReason);
  }, [RUT, socialReason]);

  return (
    <>
      <h2 className="text-center font-semibold">
        {literals.firstSectionTitle}
      </h2>
      <TextField id="rut" label={literals.RUTLabel} value={RUT} disabled />
      {!hideSocialReason && (
        <TextField
          id="socialReason"
          label={literals.socialReasonLabel}
          value={socialReason}
          disabled
        />
      )}
      <TextField
        id="localName"
        label={literals.localNameLabel}
        {...handleErrors(errors, 'localName')}
        {...register('localName')}
      />
    </>
  );
};

export default BusinessInformationFormSection;
