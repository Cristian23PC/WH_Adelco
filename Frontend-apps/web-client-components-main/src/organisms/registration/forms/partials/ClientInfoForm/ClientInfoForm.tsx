import React, { type FC, useEffect } from 'react';
import { TextField } from '../../../../../uikit/input';
import { DropdownWithPrefixes } from '../../../../../uikit/input/DropdownWithPrefixes';
import { useFormContext } from 'react-hook-form';
import { formatPhone, splitPrefix } from '../../../../../utils/phone';
import classNames from 'classnames';

export interface Values {
  firstName: string;
  surname: string;
  username: string;
  phone: string;
  prefix: string;
}

export const DEFAULT_LITERALS = {
  clientTitle: 'Información de cliente',
  nameLabel: 'Nombre',
  surnameLabel: 'Apellido',
  emailLabel: 'Correo electrónico',
  phoneLabel: 'Teléfono'
};

interface ClientInfoFormProps {
  readOnly?: boolean;
  literals: { [key in keyof typeof DEFAULT_LITERALS]: string };
}

const ClientInfoForm: FC<ClientInfoFormProps> = ({
  readOnly = false,
  literals
}) => {
  const {
    setValue,
    getValues,
    watch,
    formState: { errors },
    register
  } = useFormContext<Values>();

  useEffect(() => {
    const [prefix, phone] = splitPrefix(getValues().phone);
    setValue('phone', formatPhone(phone) ?? '');
    // Chile prefix by default
    setValue('prefix', prefix ?? '56');
  }, []);

  const phoneError = errors.phone ?? errors.prefix;
  return (
    <div className="grid gap-4 tablet:gap-6 desktop:gap-4">
      {literals.clientTitle && (
        <h2 className="leading-[22px] text-center">{literals.clientTitle}</h2>
      )}
      <div className="grid gap-2">
        <div
          className={classNames('flex gap-2', {
            'desktop:mb-1.5': !!errors.firstName || !!errors.surname
          })}
        >
          <div className="grow">
            <TextField
              label={literals.nameLabel}
              helperIcon="error"
              variant={errors.firstName ? 'failure' : 'none'}
              helperText={errors.firstName?.message}
              id="firstName"
              disabled={readOnly}
              {...register('firstName')}
            />
          </div>
          <div className="grow">
            <TextField
              label={literals.surnameLabel}
              helperIcon="error"
              variant={errors.surname ? 'failure' : 'none'}
              helperText={errors.surname?.message}
              id="surname"
              disabled={readOnly}
              {...register('surname')}
            />
          </div>
        </div>
        <div className={classNames({ 'desktop:mb-1.5': errors.username })}>
          <TextField
            label={literals.emailLabel}
            helperIcon="error"
            variant={errors.username ? 'failure' : 'none'}
            helperText={errors.username?.message}
            id="username"
            disabled={readOnly}
            {...register('username')}
          />
        </div>
        <div className="flex gap-2">
          <DropdownWithPrefixes
            className="!min-w-0 w-4/5 mobile:w-1/2 tablet:w-5/12"
            value={watch('prefix')}
            data-testid="prefix-dropdown"
            disabled={readOnly}
            onChange={(value) => {
              setValue('prefix', value);
            }}
          />
          <div
            className={classNames('grow', {
              'desktop:-mb-[22px]': !!phoneError
            })}
          >
            <TextField
              label={literals.phoneLabel}
              helperIcon="error"
              variant={phoneError ? 'failure' : 'none'}
              helperText={phoneError?.message}
              type="tel"
              id="phone"
              disabled={readOnly}
              {...register('phone', {
                onChange: (e) => {
                  setValue('phone', formatPhone(e.currentTarget.value));
                }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoForm;
