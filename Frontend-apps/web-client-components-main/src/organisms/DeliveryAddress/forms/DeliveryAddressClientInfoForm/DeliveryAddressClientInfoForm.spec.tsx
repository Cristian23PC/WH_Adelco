import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DeliveryAddressClientInfoForm from './DeliveryAddressClientInfoForm';
import userEvent from '@testing-library/user-event';
import { type FormValues } from './types';

describe('DeliveryAddressClientInfoForm', () => {
  it('should render the component', () => {
    render(
      <DeliveryAddressClientInfoForm onSubmit={jest.fn()} onBack={jest.fn()} />
    );

    expect(
      screen.getByTestId('adelco-delivery-address-client-info-form')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Ingresa los datos de contacto de esta sucursal')
    ).toBeInTheDocument();
  });

  it('should call onSubmit function with the right values', async () => {
    const mockOnSubmit = jest.fn();
    const values: FormValues = {
      firstName: 'primer nombre',
      surname: 'apellido',
      username: 'username@gmail.com',
      phone: '123456789',
      prefix: '56'
    };
    const { prefix, phone, ...restValues } = values;

    render(
      <DeliveryAddressClientInfoForm
        onSubmit={mockOnSubmit}
        onBack={jest.fn()}
      />
    );

    userEvent.type(screen.getByLabelText('Nombre'), values.firstName);
    userEvent.type(screen.getByLabelText('Apellido'), values.surname);
    userEvent.type(
      screen.getByLabelText('Correo electrónico'),
      values.username
    );
    userEvent.type(screen.getByLabelText('Teléfono'), values.phone);

    userEvent.click(screen.getByText('Confirmar'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        ...restValues,
        phone: `${prefix}${phone}`
      });
    });
  });

  it('should show all the error messages on sumbit with empty values', async () => {
    render(
      <DeliveryAddressClientInfoForm onSubmit={jest.fn()} onBack={jest.fn()} />
    );

    userEvent.click(screen.getByText('Confirmar'));

    await waitFor(() => {
      expect(screen.getByText('Nombre incompleto')).toBeInTheDocument();
    });
    expect(screen.getByText('Apellido incompleto')).toBeInTheDocument();
    expect(screen.getByText('Correo inválido')).toBeInTheDocument();
    expect(screen.getByText('Teléfono incompleto')).toBeInTheDocument();
  });

  it('should call onBack function', async () => {
    const mockOnBack = jest.fn();

    render(
      <DeliveryAddressClientInfoForm onSubmit={jest.fn()} onBack={mockOnBack} />
    );

    userEvent.click(screen.getByText('Atrás'));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
