import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import PasswordRecoveryForm from './PasswordRecoveryForm';

describe('PasswordRecoveryForm', () => {
  it('should render', () => {
    render(<PasswordRecoveryForm onSubmit={() => {}} onBack={() => {}} />);

    const element = screen.getByTestId('adelco-password-recovery-form');

    expect(element).toBeInTheDocument();
  });

  it('Should execute onBack when back button is clicked', () => {
    const onBack = jest.fn();

    render(<PasswordRecoveryForm onSubmit={() => {}} onBack={onBack} />);

    const backButton = screen.getAllByRole('button')[0];

    fireEvent.click(backButton);

    expect(onBack).toHaveBeenCalled();
  });

  it('Should display custom error', async () => {
    const email = 'emai@example.es';
    const customError = 'Este correo no tiene cuenta';
    render(
      <PasswordRecoveryForm
        onSubmit={() => {}}
        onBack={() => {}}
        value={email}
        customError={customError}
      />
    );

    const message = screen.getByText(customError);
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass('text-failure');

    const input = screen
      .getByTestId('adelco-textfield')
      ?.querySelector('input');
    await act(async () => {
      if (input) {
        fireEvent.change(input, { target: { value: 'otracuenta@ejemplo.es' } });
      }
    });

    expect(screen.queryByText(customError)).not.toBeInTheDocument();
  });
});
