import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import DeliveryAddressModal from './DeliveryAddressModal';

const mockAddressList = [
  {
    id: '1',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '2',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '3',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  },
  {
    id: '4',
    commune: 'Maipú',
    streetName: 'Av. Américo Vespucio',
    streetNumber: '12389'
  }
];

describe('DeliveryAddressModal', () => {
  it('Should render', () => {
    render(
      <DeliveryAddressModal
        addressList={mockAddressList}
        selectedAddressId=""
        onSelectAddress={() => {}}
        onClose={() => {}}
        onAddAddress={() => {}}
        onAddressChange={() => {}}
        open
      />
    );

    const modal = screen.getByTestId('adelco-delivery-address-modal');
    const addresses = screen.getAllByTestId('adelco-option-radio');

    expect(modal).toBeInTheDocument();
    expect(addresses).toHaveLength(4);
  });

  it('Should render with selected address', () => {
    render(
      <DeliveryAddressModal
        addressList={mockAddressList}
        selectedAddressId="1"
        onSelectAddress={() => {}}
        onClose={() => {}}
        onAddAddress={() => {}}
        onAddressChange={() => {}}
        open
      />
    );

    const options = screen.getAllByRole('radio');

    expect(options[0]).toBeChecked();
  });

  it('Should call onSelectAddress when click on address', () => {
    const onSelectAddress = jest.fn();
    render(
      <DeliveryAddressModal
        addressList={mockAddressList}
        selectedAddressId=""
        onSelectAddress={onSelectAddress}
        onClose={() => {}}
        onAddAddress={() => {}}
        onAddressChange={() => {}}
        open
      />
    );

    const options = screen.getAllByRole('radio');

    options[0].click();

    expect(onSelectAddress).toHaveBeenCalledWith('1');
  });

  it('Should execute onAddAddress when click on add address button', () => {
    const onAddAddress = jest.fn();
    render(
      <DeliveryAddressModal
        addressList={mockAddressList}
        selectedAddressId=""
        onSelectAddress={() => {}}
        onClose={() => {}}
        onAddressChange={() => {}}
        open
        onAddAddress={onAddAddress}
      />
    );

    const button = screen.getByText('Añadir nueva dirección de envío');

    fireEvent.click(button);

    expect(onAddAddress).toHaveBeenCalled();
  });

  it('Should execute onAddressChange when click on change address button', () => {
    const onAddressChange = jest.fn();
    render(
      <DeliveryAddressModal
        addressList={mockAddressList}
        selectedAddressId=""
        onAddAddress={() => {}}
        onSelectAddress={() => {}}
        onClose={() => {}}
        open
        onAddressChange={onAddressChange}
      />
    );

    const button = screen.getByText('Cambiar dirección');

    fireEvent.click(button);

    expect(onAddressChange).toHaveBeenCalled();
  });
});
