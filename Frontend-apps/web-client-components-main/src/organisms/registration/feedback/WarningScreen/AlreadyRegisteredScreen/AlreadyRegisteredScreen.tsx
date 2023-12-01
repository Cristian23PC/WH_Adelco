import React, { type FC } from 'react';
import useScreen from '../../../../../utils/hooks/useScreen/useScreen';
import classNames from 'classnames';
import { Button } from '../../../../../uikit/actions';
import WarningScreen from '../WarningScreen';

export const DEFAULT_LITERALS = {
  header: (
    <span>
      Tu correo electrónico <br /> ya está asociado a una cuenta
    </span>
  ),
  loginLabel: 'Iniciar Sesión'
};

export interface AlreadyRegisteredScreenProps {
  'data-testid'?: string;
  onLogin: VoidFunction;
  literals?: {
    [key in keyof typeof DEFAULT_LITERALS]: string | React.JSX.Element;
  };
}
const AlreadyRegisteredScreen: FC<AlreadyRegisteredScreenProps> = ({
  'data-testid': dataTestId = 'already-registered-screen',
  onLogin,
  literals
}) => {
  const { isMobile } = useScreen();

  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <WarningScreen
      variant="done"
      title={DEFAULT_LITERALS.header}
      data-testid={dataTestId}
    >
      <div className={classNames('py-4 w-full tablet:w-[300px]')}>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onLogin}
          size={isMobile ? 'md' : 'sm'}
        >
          {l.loginLabel}
        </Button>
      </div>
    </WarningScreen>
  );
};

export default AlreadyRegisteredScreen;
