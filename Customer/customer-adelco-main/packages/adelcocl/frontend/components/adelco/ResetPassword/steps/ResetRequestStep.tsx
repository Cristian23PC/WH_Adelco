import React, { FC, useState } from 'react';
import { PasswordRecoveryForm, toast } from '@adelco/web-components';
import { useRouter } from 'next/router';
import { OnChangeStep, STEPS } from '../useStep';
import useCodeResend from 'frontastic/actions/adelco/user/useCodeResend/useCodeResend';
import useTrackLogin from 'helpers/hooks/analytics/useTrackLogin';

interface ResetRequestProps {
  onChangeStep: OnChangeStep;
}

interface FormValues {
  email: string;
}
const ResetRequest: FC<ResetRequestProps> = ({ onChangeStep }) => {
  const router = useRouter();
  const { trackAddEmailPasswordRecovery } = useTrackLogin();
  const { trigger: codeResend } = useCodeResend();
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async ({ email }: FormValues) => {
    setError('');
    setEmail(email);
    const userData = { email };

    try {
      await codeResend({ username: email });

      trackAddEmailPasswordRecovery(userData);

      onChangeStep(STEPS.CODE_VALIDATION, {
        email
      });
    } catch (e) {
      const statusCode = e?.error?.statusCode || 500;
      trackAddEmailPasswordRecovery(userData, true);

      const errorMessage =
        statusCode >= 400 && statusCode < 500
          ? 'Este correo no tiene cuenta'
          : statusCode >= 500
          ? 'Ha habido un problema con el servidor'
          : '';

      setError(errorMessage);
    }
  };

  return (
    <PasswordRecoveryForm
      onBack={() => router.push('/')}
      onSubmit={handleSubmit}
      customError={error}
      value={email}
    />
  );
};

export default ResetRequest;
