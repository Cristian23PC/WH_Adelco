import React from 'react';
import { render, screen } from '@testing-library/react';
import ChangePasswordForm from './ChangePasswordForm';

describe('ChangePasswordForm', () => {
  it('should render', () => {
    render(<ChangePasswordForm onSubmit={() => {}} />);

    const element = screen.getByTestId('adelco-change-password-form');
    const button = screen.getByText('Confirmar');

    expect(element).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});
