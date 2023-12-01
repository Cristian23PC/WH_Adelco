/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, type FC, useState } from 'react';
import { Button, TextField } from '../../../../uikit';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import PasswordRecoverySchema, {
  DEFAULT_LITERALS as FORM_ERROR_LITERALS
} from './PasswordRecoverySchema';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';

const DEFAULT_LITERALS = {
  ...FORM_ERROR_LITERALS,
  title: 'Restablecer la contraseña',
  instructions: 'Por favor introduzca su correo electrónico.',
  aclaration:
    'Recibirás un código de verificación en tu correo electrónico que deberás introducir en la siguiente página.',
  emailLabel: 'Correo electrónico',
  submitButtonLabel: 'Enviar solicitud'
};

interface FormValues {
  email: string;
}

export interface PasswordRecoveryFormProps {
  literals?: {
    [key in keyof typeof DEFAULT_LITERALS]: string;
  };
  onSubmit: (values: FormValues) => Promise<void> | void;
  onBack: VoidFunction;
  customError?: string;
  value?: string;
}
const PasswordRecoveryForm: FC<PasswordRecoveryFormProps> = ({
  literals,
  onSubmit,
  onBack,
  customError,
  value
}) => {
  const { isMobile } = useScreen();
  const [responseError, setResponseError] = useState<string>('');
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormValues>({
    resolver: yupResolver(PasswordRecoverySchema(l)),
    mode: 'onBlur',
    reValidateMode: 'onBlur'
  });

  useEffect(() => {
    setResponseError(customError ?? '');
  }, [customError]);

  useEffect(() => {
    if (responseError && value) {
      setError('email', {
        type: 'manual',
        message: responseError
      });
      setValue('email', value);
    } else {
      clearErrors('email');
    }
  }, [responseError, value]);

  const emailTextfield = register('email');

  const handleEmailChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setResponseError('');
    clearErrors('email');
    await emailTextfield.onChange(e);
  };

  return (
    <>
      <Button
        onClick={onBack}
        className="absolute left-4 top-4"
        variant="tertiary"
        iconName="arrow_back"
      />
      <div
        className="text-sm tablet:text-xs flex flex-col gap-4 desktop:gap-2 text-center mx-auto mt-[121px] tablet:mt-[100px] tablet:max-w-[300px]"
        data-testid="adelco-password-recovery-form"
      >
        <h1 className="font-semibold text-base tablet:mb-2">{l.title}</h1>
        <p className="desktop:mb-6">{l.instructions}</p>
        <p className="font-semibold">{l.aclaration}</p>
        <form
          className="flex flex-col gap-2 mt-10 tablet:mt-0"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(async (values) => {
            await onSubmit(values);
          })}
        >
          <TextField
            id="email"
            variant={errors.email ? 'failure' : 'none'}
            helperText={errors.email?.message ?? ''}
            label={l.emailLabel}
            {...emailTextfield}
            onChange={handleEmailChange}
          />
          <div>
            <Button
              className="my-4 mx-auto"
              type="submit"
              variant="secondary"
              loading={isSubmitting}
              disabled={!isValid || isSubmitting}
              block={isMobile}
              size={isMobile ? 'md' : 'sm'}
            >
              {l.submitButtonLabel}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PasswordRecoveryForm;
