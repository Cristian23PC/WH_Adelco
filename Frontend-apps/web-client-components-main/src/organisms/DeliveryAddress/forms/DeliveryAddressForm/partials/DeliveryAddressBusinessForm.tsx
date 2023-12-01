import React, { type FC } from 'react';
import { TextField } from '../../../../../uikit/input';
import { useFormContext } from 'react-hook-form';
import { type FormValues } from '../types';
import { handleErrors } from '../../../../registration/forms/BusinessInformationForm/partials/utils';

export const DEFAULT_LITERALS = {
  localNameLabel: 'Nombre de tu local'
};

interface DeliveryAddressBusinessFormProps {
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
}
const DeliveryAddressBusinessForm: FC<DeliveryAddressBusinessFormProps> = ({
  literals
}) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<FormValues>();

  return (
    <TextField
      id="localName"
      label={literals.localNameLabel}
      {...handleErrors(errors, 'localName')}
      {...register('localName')}
    />
  );
};

export default DeliveryAddressBusinessForm;
