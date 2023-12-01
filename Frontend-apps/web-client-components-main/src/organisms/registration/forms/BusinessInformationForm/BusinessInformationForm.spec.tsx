import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BusinessInformationForm from './BusinessInformationForm';
import { linkRendererMock } from '../../../../uikit/navigation/CategoriesMenu/CategoriesMenuMocks';
import MapForm, { DEFAULT_LITERALS as MAP_LITERALS } from './partials/MapForm';
import * as utils from './partials/utils';
import { FormProvider, useForm } from 'react-hook-form';

const mockSteps = [
  { title: 'Información de negocios', step: 1 },
  { title: 'asdf', step: 2 },
  { title: 'fff', step: 3 }
];

const mockFormMethods = {
  getValues: jest.fn(),
  setValue: jest.fn()
};

const MockFormWrapper: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const methods = useForm();

  return (
    <FormProvider {...methods} {...mockFormMethods}>
      {children}
    </FormProvider>
  );
};

describe('BusinessInformationForm', () => {
  const renderComponent = (args = {}): void => {
    render(
      <BusinessInformationForm
        onSubmit={() => {}}
        onRegionChange={() => {}}
        onCommuneChange={() => {}}
        linkRenderer={linkRendererMock}
        leaveRegisterLink="#"
        steps={mockSteps}
        RUT="76.392.099-7"
        socialReason="reason"
        regionList={[]}
        communeList={[]}
        localityList={[]}
        {...args}
      />
    );
  };
  it('should render component', () => {
    renderComponent();

    const form = screen.getByTestId('adelco-business-information-form');

    expect(form).toBeInTheDocument();
  });

  describe('MapForm', () => {
    it('should set coordinates when button click', async () => {
      const defaultPosition = { lat: 1, long: 1 };
      jest
        .spyOn(utils, 'getCoordinates')
        .mockImplementation(async () => await Promise.resolve(defaultPosition));
      render(
        <MockFormWrapper>
          <MapForm literals={MAP_LITERALS} />
        </MockFormWrapper>
      );

      const button = screen.getByText(
        MAP_LITERALS.placeConfirmationButtonLabel
      );

      fireEvent.click(button);

      expect(mockFormMethods.getValues).toHaveBeenCalledTimes(4);
      expect(mockFormMethods.getValues).toHaveBeenCalledWith('street');
      expect(mockFormMethods.getValues).toHaveBeenCalledWith('streetNumber');
      expect(mockFormMethods.getValues).toHaveBeenCalledWith('commune');
      expect(mockFormMethods.getValues).toHaveBeenCalledWith('region');

      await waitFor(() => {
        expect(mockFormMethods.setValue).toHaveBeenCalledWith(
          'coordinates',
          defaultPosition
        );
      });
    });

    it('should set default coordinates when method throw an error', async () => {
      const defaultPosition = { lat: 1, long: 1 };
      jest
        .spyOn(utils, 'getCoordinates')
        .mockImplementation(async () => await Promise.reject(defaultPosition));
      render(
        <MockFormWrapper>
          <MapForm literals={MAP_LITERALS} />
        </MockFormWrapper>
      );

      const button = screen.getByText(
        MAP_LITERALS.placeConfirmationButtonLabel
      );

      fireEvent.click(button);

      await waitFor(() => {
        expect(mockFormMethods.setValue).toHaveBeenCalledWith(
          'coordinates',
          utils.defaultPosition
        );
      });
    });
  });
});
