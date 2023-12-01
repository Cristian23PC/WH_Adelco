import React, { type FC } from 'react';
import { Button, TextField } from '../../../../uikit';
import { Logo } from '../../../../foundation';
import { type LinkRenderer } from '../../../../utils/types';
import useScreen from '../../../../utils/hooks/useScreen/useScreen';
import { type UseFormReturn } from 'react-hook-form';

export const DEFAULT_LITERALS = {
  title: 'Ingresa tus credenciales',
  userPlaceholder: 'Correo electrónico',
  passwordPlaceholder: 'Contraseña',
  forgotPassword: 'Olvidé mi Contraseña',
  submit: 'Ingresar',
  dontHaveAccount: '¿No tienes cuenta?',
  dontHaveAccountLink: 'Regístrate aquí',
  enterAsInvited: 'Ingresa como invitado'
};

export interface Values {
  username: string;
  password: string;
}

export interface LoginFormProps {
  formController: UseFormReturn<Values>;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  linkRenderer: LinkRenderer;
  resetPasswordLink: string;
  registerLink: string;
  onClickInvitedLink?: () => void;
}

const LoginForm: FC<LoginFormProps> = ({
  formController,
  literals = {},
  linkRenderer,
  resetPasswordLink,
  registerLink,
  onClickInvitedLink
}) => {
  const { isMobile } = useScreen();
  const {
    register,
    formState: { errors, isSubmitting },
    getValues
  } = formController;

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div className="flex flex-col w-[256px] tablet:w-[300px] items-center gap-4 tablet:gap-8">
      <Logo width={isMobile ? 120 : 130} />
      <div className="pt-8 tablet:pt-0 font-bold desktop:text-sm ">
        {l.title}
      </div>
      <div className="flex w-full flex-col gap-2 tablet:gap-4">
        <TextField
          label={l.userPlaceholder}
          id="email"
          variant={errors.username ? 'failure' : 'none'}
          helperText={errors.username?.message}
          helperIcon="error"
          {...register('username')}
        />
        <TextField
          type="password"
          id="password"
          label={l.passwordPlaceholder}
          variant={errors.password ? 'failure' : 'none'}
          helperText={errors.password?.message}
          helperIcon="error"
          {...register('password')}
        />
        <div className="pt-4 tablet:py-2 text-sm font-semibold underline hover:cursor-pointer">
          {linkRenderer(
            resetPasswordLink,
            l.forgotPassword,
            undefined,
            getValues
          )}
        </div>
        <Button
          className="my-4 tablet:my-0"
          variant="secondary"
          type="submit"
          disabled={isSubmitting}
          loading={isSubmitting}
          size={isMobile ? 'md' : 'sm'}
        >
          {l.submit}
        </Button>
      </div>
      <div className="text-sm leading-6 tablet:leading-[19px]">
        {l.dontHaveAccount}
        <span className="ml-1 font-bold underline hover:cursor-pointer">
          {linkRenderer(registerLink, l.dontHaveAccountLink)}
        </span>
      </div>
      <div className="text-sm">
        <div className="inline-flex items-center justify-center w-full">
          <hr className="w-[150px] h-px bg-silver border-0" />
          <span className="absolute px-5 -translate-x-1/2 left-1/2 bg-white">
            o
          </span>
        </div>
        <div
          className="mt-3 font-bold leading-6 tablet:leading-[19px] underline hover:cursor-pointer "
          onClick={onClickInvitedLink}
        >
          {l.enterAsInvited}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
