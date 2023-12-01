import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DeliveryAddressForm from './DeliveryAddressForm';
import userEvent from '@testing-library/user-event';
import { type FormValues } from './types';

describe('DeliveryAddressForm', () => {
  it('should render the component', () => {
    render(
      <DeliveryAddressForm
        onSubmit={jest.fn()}
        onBack={jest.fn()}
        regionList={[]}
        communeList={[]}
        localityList={[]}
        onRegionChange={jest.fn()}
        onCommuneChange={jest.fn()}
      />
    );

    expect(
      screen.getByTestId('adelco-delivery-address-form')
    ).toBeInTheDocument();
    expect(screen.getByText('Agregar nueva dirección')).toBeInTheDocument();
  });

  it('should call onSubmit function with the right values', async () => {
    const mockOnSubmit = jest.fn();
    const values: FormValues = {
      localName: 'nombre del local',
      region: 'region',
      commune: 'comuna',
      locality: 'localidad',
      street: 'calle',
      streetNumber: '20',
      noStreetNumber: false,
      apartment: 'numero de oficina',
      additionalInformation: 'informacion adicional',
      coordinates: { lat: 10, long: 10 }
    };
    render(
      <DeliveryAddressForm
        onSubmit={mockOnSubmit}
        onBack={jest.fn()}
        regionList={[{ label: 'region 1', value: values.region }]}
        communeList={[{ label: 'comuna 1', value: values.commune }]}
        localityList={[{ label: 'localidad 1', value: values.locality ?? '' }]}
        onRegionChange={jest.fn()}
        onCommuneChange={jest.fn()}
        defaultValues={{
          coordinates: values.coordinates,
          noStreetNumber: values.noStreetNumber
        }}
      />
    );

    userEvent.type(
      screen.getByLabelText('Nombre de tu local'),
      values.localName
    );

    userEvent.type(screen.getByLabelText('Calle'), values.street);
    userEvent.type(screen.getByLabelText('Número'), values.streetNumber ?? '');
    userEvent.type(
      screen.getByLabelText('Nº de oficina / depto / casa (opcional)'),
      values.apartment ?? ''
    );
    userEvent.type(
      screen.getByLabelText('Información adicional (opcional)'),
      values.additionalInformation ?? ''
    );

    userEvent.click(
      screen.getByTestId('adelco-region-dropdown').firstChild as Element
    );

    await waitFor(() => {
      userEvent.click(screen.getByText('region 1'));
    });

    userEvent.click(
      screen.getByTestId('adelco-commune-dropdown').firstChild as Element
    );

    await waitFor(() => {
      userEvent.click(screen.getByText('comuna 1'));
    });

    userEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(values);
    });
  });

  it('should show all the error messages on sumbit with empty values', async () => {
    render(
      <DeliveryAddressForm
        onSubmit={jest.fn()}
        onBack={jest.fn()}
        regionList={[]}
        communeList={[]}
        localityList={[]}
        onRegionChange={jest.fn()}
        onCommuneChange={jest.fn()}
        defaultValues={{ coordinates: { lat: 10, long: 10 } }}
      />
    );

    userEvent.click(screen.getByText('Siguiente'));

    await waitFor(() => {
      expect(
        screen.getByText('El nombre del local es obligatorio')
      ).toBeInTheDocument();
    });
    expect(screen.getByText('La región es obligatoria')).toBeInTheDocument();
    expect(screen.getByText('La comuna es obligatoria')).toBeInTheDocument();
    expect(screen.getByText('La calle es obligatoria')).toBeInTheDocument();
    expect(
      screen.getByText('Introduzca el número de la calle')
    ).toBeInTheDocument();
  });

  it('should call onBack function', async () => {
    const mockOnBack = jest.fn();

    render(
      <DeliveryAddressForm
        onSubmit={jest.fn()}
        onBack={mockOnBack}
        regionList={[]}
        communeList={[]}
        localityList={[]}
        onRegionChange={jest.fn()}
        onCommuneChange={jest.fn()}
      />
    );

    userEvent.click(screen.getByText('Atrás'));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
