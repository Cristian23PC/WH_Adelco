import React, { FC } from 'react';
import { ChangePasswordForm, toast } from '@adelco/web-components';
import { useRouter } from 'next/router';
import { Values } from '../useStep';
import useResetPassword from 'frontastic/actions/adelco/user/useResetPassword/useResetPassword';
import useLogin from 'frontastic/actions/adelco/user/useLogin/useLogin';

interface ResetPasswordProps {
  values: Values;
}

const ResetPasswordStep: FC<ResetPasswordProps> = ({ values }) => {
  const router = useRouter();
  const { trigger: resetPassword } = useResetPassword();
  const { trigger: login } = useLogin();

  const handleSubmit = async ({ password }) => {
    const { statusCode } = await resetPassword({
      username: values.email,
      password,
      code: values.code
    });

    if (statusCode >= 400) {
      /* There is no design for an internal error */
      toast.error({
        text: 'Error inesperado',
        position: 'top-right'
      });
    } else {
      await login({ username: values.email, password });
      router.push('/');
    }
  };

  return (
    <div className="tablet:m-auto tablet:w-[320px]">
      <ChangePasswordForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ResetPasswordStep;
