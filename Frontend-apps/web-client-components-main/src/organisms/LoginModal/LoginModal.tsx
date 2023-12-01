import React, { type FC } from 'react';
import LoginForm, {
  type Values,
  DEFAULT_LITERALS as DEFAULT_LITERALS_LOGIN_FORM,
  loginSchema
} from './partials/LoginForm';
import { Modal } from '../../uikit';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { type LinkRenderer } from '../../utils/types';

export const DEFAULT_LITERALS = DEFAULT_LITERALS_LOGIN_FORM;
export interface LoginModalProps {
  open?: boolean;
  onClose: VoidFunction;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onSubmit: (values: Values) => Promise<void> | void;
  defaultValues?: Partial<Values>;
  linkRenderer: LinkRenderer;
  resetPasswordLink: string;
  registerLink: string;
  onClickInvitedLink?: () => void;
}

const LoginModal: FC<LoginModalProps> = ({
  open = false,
  onClose,
  literals = {},
  defaultValues = {},
  onSubmit,
  linkRenderer,
  resetPasswordLink,
  registerLink,
  onClickInvitedLink
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  const formController = useForm<Values>({
    defaultValues,
    resolver: yupResolver(loginSchema(l))
  });
  const { handleSubmit } = formController;

  return (
    <Modal id="login-modal" open={open} onClose={onClose}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <LoginForm
          formController={formController}
          literals={l}
          linkRenderer={linkRenderer}
          resetPasswordLink={resetPasswordLink}
          registerLink={registerLink}
          onClickInvitedLink={onClickInvitedLink}
        />
      </form>
    </Modal>
  );
};

export default LoginModal;
