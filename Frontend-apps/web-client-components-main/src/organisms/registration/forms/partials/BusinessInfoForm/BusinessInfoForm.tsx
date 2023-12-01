import React, { type FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Dropdown, TextField } from '../../../../../uikit/input';
import classNames from 'classnames';

export interface Values {
  rut: string;
  razonSocial?: string;
  giro?: string;
}
export const DEFAULT_LITERALS = {
  businessTitle: 'Información del negocio',
  rutLabel: 'RUT de empresa (sin puntos ni guión)',
  razonSocialLabel: 'Razón social',
  giroLabel: 'Giro'
};

interface BusinessInfoFormProps {
  readOnly?: boolean;
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
  expanded?: boolean;
  giroOptions?: Array<{ value: string; label: string }>;
  externalComponent?: React.ReactNode;
}

const BusinessInfoForm: FC<BusinessInfoFormProps> = ({
  readOnly = false,
  literals,
  expanded = false,
  giroOptions = [],
  externalComponent
}) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch
  } = useFormContext<Values>();

  return (
    <div
      className={classNames('grid gap-4 tablet:gap-6 desktop:gap-4', {
        'desktop:-mb-3': !!errors.rut
      })}
    >
      <h2 className="leading-[22px] text-center">{literals.businessTitle}</h2>
      <div className="grid gap-2">
        <TextField
          label={literals.rutLabel}
          helperIcon="error"
          variant={errors.rut ? 'failure' : 'none'}
          helperText={errors.rut?.message}
          id="rut"
          disabled={readOnly}
          {...register('rut')}
        />
        {externalComponent}
      </div>
      {expanded && (
        <>
          <TextField
            label={literals.razonSocialLabel}
            helperIcon="error"
            variant={errors.razonSocial ? 'failure' : 'none'}
            helperText={errors.razonSocial?.message}
            id="razon-social"
            disabled={readOnly}
            {...register('razonSocial')}
          />
          {Boolean(giroOptions.length) && (
            <Dropdown
              label={literals.giroLabel}
              options={giroOptions}
              value={watch('giro')}
              onChange={(value) => {
                setValue('giro', value);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BusinessInfoForm;
