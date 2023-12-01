import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import LoginCard from './LoginCard';

describe('LoginCard', () => {
  it('should render', () => {
    render(<LoginCard onLogoutClick={() => {}} />);

    const card = screen.getByTestId('adelco-login-card');
    expect(card).toBeInTheDocument();
  });

  it('Should execute create account callback', () => {
    const createAccountCallback = jest.fn();
    render(
      <LoginCard
        onLogoutClick={() => {}}
        createAccountCallback={createAccountCallback}
      />
    );

    const createAccountButton = screen.getByText('Crear cuenta');
    fireEvent.click(createAccountButton);

    expect(createAccountCallback).toHaveBeenCalled();
  });

  it('Should execute onLoginClick', () => {
    const onLoginClick = jest.fn();
    render(<LoginCard onLogoutClick={() => {}} onLoginClick={onLoginClick} />);

    const hasAccountButton = screen.getByText('ingresa aquí');
    fireEvent.click(hasAccountButton);

    expect(onLoginClick).toHaveBeenCalled();
  });

  it('Should execute onLogoutClick', () => {
    const onLogoutClick = jest.fn();
    render(
      <LoginCard
        isLoggedIn
        onLogoutClick={onLogoutClick}
        onLoginClick={() => {}}
      />
    );

    const closeSessionButton = screen.getByText('Cerrar sesión');
    fireEvent.click(closeSessionButton);

    expect(onLogoutClick).toHaveBeenCalled();
  });
});
