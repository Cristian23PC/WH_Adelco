import React from 'react';
import ConfirmationBusinessInformationForm from './ConfirmationBusinessInformationForm';
import { fireEvent, render, screen } from '@testing-library/react';

const mockSteps = [
  { title: 'Información de negocios', step: 1 },
  { title: 'Información de facturación', step: 2 },
  { title: 'Confirmación', step: 3 }
];

const mockCustomer = {
  name: 'John Doe',
  email: 'email@mail.com',
  phone: '+56912345678'
};

const mockBillingAddress = {
  region: 'Región Metropolitana',
  commune: 'Santiago',
  locality: 'Providencia',
  street: 'Av. Providencia',
  number: '123'
};

describe('ConfirmationBusinessInformationForm', () => {
  const renderComponent = (args = {}): void => {
    render(
      <ConfirmationBusinessInformationForm
        steps={mockSteps}
        customerInformation={mockCustomer}
        billingAddress={mockBillingAddress}
        onNext={() => {}}
        onPrevious={() => {}}
        {...args}
      />
    );
  };

  it('should render', () => {
    renderComponent();

    expect(
      screen.getByTestId('confirmation-business-information-form')
    ).toBeInTheDocument();
  });

  it('Should render customer information', () => {
    renderComponent();

    expect(screen.getByText(mockCustomer.name)).toBeInTheDocument();
    expect(screen.getByText(mockCustomer.email)).toBeInTheDocument();
    expect(screen.getByText(mockCustomer.phone)).toBeInTheDocument();
  });

  it('Should render billing address', () => {
    renderComponent();

    expect(screen.getByText(mockBillingAddress.region)).toBeInTheDocument();
    expect(screen.getByText(mockBillingAddress.commune)).toBeInTheDocument();
    expect(screen.getByText(mockBillingAddress.locality)).toBeInTheDocument();
    expect(screen.getByText(mockBillingAddress.street)).toBeInTheDocument();
    expect(screen.getByText(mockBillingAddress.number)).toBeInTheDocument();
  });

  it('Should execute onNext when button is clicked', () => {
    const onNext = jest.fn();
    renderComponent({ onNext });

    const button = screen.getByText('Siguiente');

    fireEvent.click(button);

    expect(onNext).toHaveBeenCalled();
  });

  it('Should execute onPrevious when button is clicked', () => {
    const onPrevious = jest.fn();
    renderComponent({ onPrevious });

    const button = screen.getByText('Atrás');

    fireEvent.click(button);

    expect(onPrevious).toHaveBeenCalled();
  });
});
