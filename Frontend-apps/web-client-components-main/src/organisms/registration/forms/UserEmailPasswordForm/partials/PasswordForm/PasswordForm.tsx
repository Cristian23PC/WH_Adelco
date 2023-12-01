import React, { type FC } from 'react';
import { TextField } from '../../../../../../uikit/input';
import { useFormContext } from 'react-hook-form';
import classNames from 'classnames';

export interface Values {
  password: string;
  confirmPassword: string;
}

export const DEFAULT_LITERALS = {
  passwordTitle: 'Crea una contraseña',
  passwordLabel: 'Contraseña',
  confirmPasswordLabel: 'Confirmar contraseña',
  hintTitle: 'Tu contraseña necesita:',
  hint1: 'Incluir minúsculas y mayúsculas',
  hint2: 'Incluir al menos un número y símbolo',
  hint3: 'Tener al menos 8 caracteres'
};

export interface PasswordFormProps {
  literals?: { [key in keyof typeof DEFAULT_LITERALS]?: string };
  className?: string;
}

const PasswordForm: FC<PasswordFormProps> = ({ literals = {}, className }) => {
  const {
    register,
    formState: { errors }
  } = useFormContext<Values>();

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div
      className={classNames('grid gap-4 tablet:gap-6 desktop:gap-4', className)}
    >
      <h2 className="leading-[22px] text-center font-semibold">
        {l.passwordTitle}
      </h2>
      <div className="grid gap-2">
        <TextField
          label={l.passwordLabel}
          id="password"
          type="password"
          helperIcon="error"
          variant={errors.password ? 'failure' : 'none'}
          helperText={errors.password?.message}
          {...register('password')}
        />
        <TextField
          label={l.confirmPasswordLabel}
          id="confirm-password"
          type="password"
          helperIcon="error"
          variant={errors.confirmPassword ? 'failure' : 'none'}
          helperText={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <div className="mt-6 tablet:mt-4 desktop:mt-2 text-sm leading-[19px]">
          <div className="font-bold text-corporative-03 mb-2">
            {l.hintTitle}
          </div>
          <ul className="flex flex-col gap-0.5 pl-6 list-disc text-corporative-03">
            <li className="marker:mr-2">
              <span className="relative left-[-2px]">{l.hint1}</span>
            </li>
            <li className="marker:mr-2">
              <span className="relative left-[-2px]">{l.hint2}</span>
            </li>
            <li className="marker:mr-2">
              <span className="relative left-[-2px]">{l.hint3}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PasswordForm;
