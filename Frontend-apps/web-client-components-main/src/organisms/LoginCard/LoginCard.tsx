import React, { type FC } from 'react';
import LoggedContent from './partials/LoggedContent';
import NotLoggedContent from './partials/NotLoggedContent';

export const DEFAULT_LITERALS = {
  createAccountButton: 'Crear cuenta',
  createAccountLabel: 'Para realizar compras crea una cuenta',
  createAccountTitleTablet: '¿Eres nuevo?',
  createAccountSubtitleTablet: 'Registrate y obtén descuentos únicos',
  hasAccountLabel: 'Si ya tienes cuenta',
  hasAccountLink: 'ingresa aquí',
  salutation: 'Hola',
  subtitle:
    'Gestiona la información de tus locales, tus órdenes y tus usuarios.',
  closeSessionLabel: 'Cerrar sesión',
  goToMyAdelcoLabel: 'Ir a Mi Adelco'
};

export interface LoginCardProps {
  isLoggedIn?: boolean;
  username?: string;
  createAccountCallback?: VoidFunction;
  onLogoutClick: VoidFunction;
  literals?: { [key in keyof typeof DEFAULT_LITERALS]: string };
  onLoginClick?: VoidFunction;
  'data-testid'?: string;
}
const LoginCard: FC<LoginCardProps> = ({
  isLoggedIn,
  createAccountCallback,
  username = '',
  onLoginClick,
  onLogoutClick,
  literals = {},
  'data-testid': dataTestId = 'adelco-login-card'
}) => {
  const l = {
    ...DEFAULT_LITERALS,
    ...literals
  };

  return (
    <div
      data-testid={dataTestId}
      className="pb-px bg-snow text-corporative-02 text-xs"
    >
      {isLoggedIn && (
        <LoggedContent
          onCloseSession={onLogoutClick}
          literals={l}
          username={username}
        />
      )}
      {!isLoggedIn && (
        <NotLoggedContent
          literals={l}
          createAccountCallback={createAccountCallback}
          onLoginClick={onLoginClick}
        />
      )}
    </div>
  );
};

export default LoginCard;
