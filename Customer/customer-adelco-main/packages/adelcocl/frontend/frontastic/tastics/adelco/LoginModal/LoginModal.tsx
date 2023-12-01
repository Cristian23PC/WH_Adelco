import { FC, ReactNode, useCallback } from 'react';
import { LoginModal as UILoginModal, toast } from '@adelco/web-components';
import useLogin from 'frontastic/actions/adelco/user/useLogin/useLogin';
import { EmailPassword } from '@Types/adelco/user';
import Link from 'next/link';
import useTrackLogin from '../../../../helpers/hooks/analytics/useTrackLogin';
import { UseFormGetValues } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useModalContext } from '../../../../contexts/modalContext';

const resetPasswordLink = '/reset-password';

const LinkRenderer = (
  link: string,
  label: ReactNode,
  _,
  getFormValues: UseFormGetValues<EmailPassword>
) => {
  const { trackOpenPasswordRecovery } = useTrackLogin();
  const { closeLoginModal } = useModalContext();

  const handleClickLink = () => {
    link === resetPasswordLink &&
      trackOpenPasswordRecovery({ email: getFormValues?.()?.username });
    closeLoginModal();
  };

  return (
    <Link href={link}>
      <span onClick={handleClickLink}>{label}</span>
    </Link>
  );
};

type Props = {
  open?: boolean;
  onClose: VoidFunction;
};

const LoginModal: FC<Props> = ({ open, onClose }) => {
  const router = useRouter();
  const { trackLoginSuccess } = useTrackLogin();
  const { trigger: login } = useLogin();
  const { openZoneModal } = useModalContext();

  const handleLogin = useCallback(
    async (values: EmailPassword) => {
      try {
        const user = await login(values);

        const userData = {
          email: user?.email,
          businessUnitId: user?.businessUnitId
        };

        trackLoginSuccess(userData);
        onClose();
        if (user.incompleteRegistration) {
          router.push(
            {
              pathname: '/register',
              query: {
                incompleteRegistration: true,
                password: values.password
              }
            },
            '/register'
          );
        }
      } catch (e) {
        toast.error({
          title: e.name,
          text: e.message,
          position: 'top-right'
        });
      }
    },
    [trackLoginSuccess]
  );

  return (
    <UILoginModal
      open={open}
      onClose={onClose}
      onSubmit={handleLogin}
      linkRenderer={LinkRenderer}
      resetPasswordLink={resetPasswordLink}
      registerLink="/register"
      onClickInvitedLink={() => {
        onClose();
        openZoneModal();
      }}
    />
  );
};

export default LoginModal;
