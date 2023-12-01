import React, { type FC } from 'react';
import {
  render,
  screen,
  act,
  fireEvent,
  cleanup
} from '@testing-library/react';
import '@testing-library/jest-dom';
import ZoneModalContent, {
  DEFAULT_LITERALS,
  type Props
} from './ZoneModalContent';
import regions from '../regions.example.json';
import communes from '../communes.example.json';
import localities from '../localities.example.json';

const onCloseMock = jest.fn();
const onRegionChangeMock = jest.fn();
const onCommuneChangeMock = jest.fn();
const onLocalityChangeMock = jest.fn();
const onSubmitMock = jest.fn();

const regionOptions = regions.map((reg) => ({
  value: reg.key,
  label: reg.label
}));

const Component: FC<Partial<Props>> = (overwrite) => (
  <ZoneModalContent
    open
    onClose={onCloseMock}
    onRegionChange={onRegionChangeMock}
    onCommuneChange={onCommuneChangeMock}
    onLocalityChange={onLocalityChangeMock}
    onSubmit={onSubmitMock}
    regionOptions={regionOptions}
    {...overwrite}
  />
);

describe('ZoneModalContent', () => {
  afterAll(() => {
    cleanup();
  });
  it('should render the component with default literals', async () => {
    await act(async () => {
      render(<Component />);
    });

    expect(screen.getByText(DEFAULT_LITERALS.title)).toBeInTheDocument();
    expect(
      screen.getByText(DEFAULT_LITERALS.regionPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByText(DEFAULT_LITERALS.communePlaceholder)
    ).toBeInTheDocument();
    expect(screen.getByText(DEFAULT_LITERALS.submit)).toBeInTheDocument();
    expect(
      screen.getByText(DEFAULT_LITERALS.alreadyAccount)
    ).toBeInTheDocument();
    expect(
      screen.getByText(DEFAULT_LITERALS.alreadyAccountLink)
    ).toBeInTheDocument();
  });

  it('should call the onRegionChange fn', async () => {
    await act(async () => {
      render(<Component />);
    });
    const regionDropdown = screen
      .getAllByTestId('adelco-dropdown')[0]
      .querySelector('button');
    if (regionDropdown != null) {
      fireEvent.click(regionDropdown);
    }

    const option = screen.getByTestId('adelco-dropdown-option-1');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);
    expect(onRegionChangeMock).toHaveBeenCalled();
  });

  it('should call the onCommuneChange fn', async () => {
    const values = { region: regions[0].key };
    const communeOptions = communes
      .filter((com) => com.region === values.region)
      .map((com) => ({ value: com.key, label: com.label }));
    await act(async () => {
      render(<Component communeOptions={communeOptions} values={values} />);
    });
    const communeDropdown = screen
      .getAllByTestId('adelco-dropdown')[1]
      .querySelector('button');
    if (communeDropdown != null) {
      fireEvent.click(communeDropdown);
    }

    const option = screen.getByTestId('adelco-dropdown-option-1');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);
    expect(onCommuneChangeMock).toHaveBeenCalled();
  });

  it('should call the onLocalityChange fn', async () => {
    const values = { region: 'arica', commune: 'arica' };
    const localityOptions = localities
      .filter((loc) => loc.commune === values.commune)
      .map((loc) => ({ value: loc.key, label: loc.label }));
    await act(async () => {
      render(<Component localityOptions={localityOptions} values={values} />);
    });
    const localityDropdown = screen
      .getAllByTestId('adelco-dropdown')[2]
      .querySelector('button');
    if (localityDropdown != null) {
      fireEvent.click(localityDropdown);
    }

    const option = screen.getByTestId('adelco-dropdown-option-0');
    expect(option).toBeInTheDocument();
    fireEvent.click(option);
    expect(onLocalityChangeMock).toHaveBeenCalled();
  });

  it('should not call the onSubmit without values fn', async () => {
    await act(async () => {
      render(<Component />);
    });
    const button = screen.getByText(DEFAULT_LITERALS.submit);
    fireEvent.click(button);

    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('should call the onSubmit fn', async () => {
    const values = { region: regions[0].key, commune: communes[0].key };
    await act(async () => {
      render(<Component values={values} />);
    });
    const button = screen.getByText(DEFAULT_LITERALS.submit);
    fireEvent.click(button);

    expect(onSubmitMock).toHaveBeenCalled();
  });
});
