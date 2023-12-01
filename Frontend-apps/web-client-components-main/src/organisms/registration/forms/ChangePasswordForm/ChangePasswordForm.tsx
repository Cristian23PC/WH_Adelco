import React, { type FC } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import PasswordForm, {
  passwordSchema,
  DEFAULT_LITERALS as DEFAULT_LITERALS_PASSWORD_FORM,
  type Values as FormValues
} from '../UserEmailPasswordForm/partials/PasswordForm';
import { Button } from '../../../../uikit';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';

const DEFAULT_LITERALS = {
  ...DEFAULT_LITERALS_PASSWORD_FORM,
  continueButtonLabel: 'Confirmar'
};
export interface ChangePasswordFormProps {
  literals?: {
    [key in keyof typeof DEFAULT_LITERALS]: string;
  };
  'data-testid'?: string;
  onSubmit: (values: FormValues) => Promise<void> | void;
}
const ChangePasswordForm: FC<ChangePasswordFormProps> = ({
  literals,
  onSubmit,
  'data-testid': testId = 'adelco-change-password-form'
}) => {
  const { isMobile } = useScreen();
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(passwordSchema(l))
  });

  const {
    formState: { isSubmitting },
    handleSubmit
  } = methods;

  return (
    <FormProvider {...methods}>
      <form
        data-testid={testId}
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
        className="grid gap-12"
      >
        <PasswordForm
          className="[&>div>div:last-child]:mt-6"
          literals={{
            passwordTitle: 'Crea tu nueva contraseña'
          }}
        />
        <Button
          className="mb-4"
          type="submit"
          variant="secondary"
          loading={isSubmitting}
          size={isMobile ? 'md' : 'sm'}
        >
          {l.continueButtonLabel}
        </Button>
      </form>
    </FormProvider>
  );
};

export default ChangePasswordForm;
