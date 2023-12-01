import React from 'react';
import {
  fireEvent,
  render,
  screen,
  act,
  cleanup
} from '@testing-library/react';
import BillingAddressForm from './BillingAddressForm';

const mockSteps = [
  { title: 'Información de negocios', step: 1 },
  { title: 'Datos de facturación', step: 2 },
  { title: 'Confirmación', step: 3 }
];

const businessAddressMock = {
  RUT: 'RUT example',
  socialReason: 'Social Reason example',
  localName: 'Localname Example',
  coordinates: { lat: 45, long: 45 },
  region: 'de-antofagasta',
  commune: 'maria-elena',
  locality: 'locality-1',
  street: 'Street Example',
  streetNumber: '34',
  apartment: '5',
  additionalInformation: 'Some extra info'
};

const onRegionChangeMock = jest.fn();
const onCommuneChangeMock = jest.fn();
const onSubmitMock = jest.fn();
const onBackMock = jest.fn();

describe('BillingAddressForm', () => {
  beforeEach(() => {
    cleanup();
  });
  const renderComponent = async (args = {}): Promise<void> => {
    await act(async () => {
      render(
        <BillingAddressForm
          onSubmit={onSubmitMock}
          onBack={onBackMock}
          onRegionChange={onRegionChangeMock}
          onCommuneChange={onCommuneChangeMock}
          steps={mockSteps}
          regionList={[]}
          communeList={[]}
          localityList={[]}
          businessAddressValues={businessAddressMock}
          {...args}
        />
      );
    });
  };

  it('should render the component', async () => {
    await renderComponent();
    expect(
      screen.getByTestId('adelco-billing-address-form')
    ).toBeInTheDocument();
  });

  it('should use business form values when use according checkbox', async () => {
    await renderComponent();
    const checkbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);

    expect(onRegionChangeMock).toHaveBeenCalledWith(businessAddressMock.region);
    expect(onCommuneChangeMock).toHaveBeenCalledWith(
      businessAddressMock.commune
    );

    expect(checkbox.checked).toBe(true);

    const street = screen
      .getAllByTestId('adelco-textfield')[0]
      .querySelector('input') as HTMLInputElement;
    expect(street.value).toEqual(businessAddressMock.street);

    const streetNumber = screen
      .getAllByTestId('adelco-textfield')[1]
      .querySelector('input') as HTMLInputElement;
    expect(streetNumber.value).toEqual(businessAddressMock.streetNumber);
  });
});
