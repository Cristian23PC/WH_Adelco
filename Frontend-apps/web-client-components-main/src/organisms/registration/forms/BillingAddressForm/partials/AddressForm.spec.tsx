import React from 'react';
import {
  fireEvent,
  render,
  screen,
  act,
  waitFor,
  cleanup
} from '@testing-library/react';
import AddressForm, { DEFAULT_LITERALS } from './AddressForm';
import regionMocks from '../../../../ZoneModal/regions.example.json';

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
const setValueMock = jest.fn();
const getValuesMock = jest.fn();
const clearErrorsMock = jest.fn();
const watchMock = jest.fn();

const regions = regionMocks.map((r) => ({ value: r.key, label: r.label }));

describe('Partial Address form', () => {
  beforeEach(() => {
    cleanup();
  });
  const renderComponent = async (args = {}): Promise<void> => {
    await act(async () => {
      render(
        <AddressForm
          onRegionChange={onRegionChangeMock}
          onCommuneChange={onCommuneChangeMock}
          setValue={setValueMock}
          getValues={getValuesMock}
          watch={watchMock}
          register={jest.fn()}
          clearErrors={clearErrorsMock}
          regionList={regions}
          communeList={[]}
          localityList={[]}
          businessAddressValues={businessAddressMock}
          errors={{}}
          literals={DEFAULT_LITERALS}
          {...args}
        />
      );
    });
  };

  it('should render the component', async () => {
    await renderComponent();
    expect(screen.getByText(DEFAULT_LITERALS.sectionTitle)).toBeInTheDocument();
  });

  it('should call onChange methods', async () => {
    await renderComponent();
    const regionDropdown = screen
      .getAllByTestId('adelco-dropdown')[0]
      .querySelector('button');
    if (regionDropdown) {
      fireEvent.click(regionDropdown);
    }
    await waitFor(() => {
      const opt = screen.getByText(regions[2].label);
      fireEvent.click(opt);
    });
    expect(onRegionChangeMock).toHaveBeenCalledWith(regions[2].value);
    const textField = screen.getAllByTestId('adelco-textfield')[0];
    if (textField) {
      fireEvent.change(textField, 'street name');
      expect(watchMock).toHaveBeenCalledWith('street');
    }
  });

  it('should erase street Number when check noNumber option', async () => {
    await renderComponent();
    const streetNumber = screen
      .getAllByTestId('adelco-textfield')[1]
      .querySelector('input') as HTMLInputElement;
    fireEvent.change(streetNumber, { target: { value: '45' } });
    expect(streetNumber.value).toBe('45');
    const checkbox = screen.getAllByRole('checkbox')[1] as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(setValueMock).toHaveBeenCalledWith('streetNumber', '');
  });

  it('should populate dropdowns and clear errors when cheking use the same address', async () => {
    await renderComponent();
    const checkbox = screen.getAllByRole('checkbox')[0] as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(onRegionChangeMock).toHaveBeenCalledWith(businessAddressMock.region);
    expect(onCommuneChangeMock).toHaveBeenCalledWith(
      businessAddressMock.commune
    );
    expect(clearErrorsMock).toHaveBeenCalled();
  });
});
