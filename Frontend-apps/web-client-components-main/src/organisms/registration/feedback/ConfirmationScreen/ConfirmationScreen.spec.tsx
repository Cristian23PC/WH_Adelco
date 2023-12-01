import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';

import ConfirmationScreen, {
  type Props,
  DEFAULT_LITERALS
} from './ConfirmationScreen';
const clickAction = jest.fn();

describe('Success Screen Component', () => {
  const renderComponent = async (args: Props): Promise<void> => {
    await act(async () => {
      render(<ConfirmationScreen {...args} />);
    });
  };

  const defaultArgs = {
    clientData: {
      name: 'Juan Pérez',
      email: 'jperez@gmail.com',
      phoneNumber: '+56 9 9320 8891'
    },
    billingAddress: {
      region: 'Región Metropolitana',
      commune: 'La Florida',
      streetName: 'Juan Pablo II',
      number: '8290'
    },
    callCenter: '600 600 6363',
    onClick: clickAction
  };

  it('should renderd the component', async () => {
    await renderComponent(defaultArgs);
    expect(screen.getByTestId('success-screen')).toBeInTheDocument();
  });

  it('should call click action', async () => {
    await renderComponent(defaultArgs);
    fireEvent.click(screen.getByRole('button'));
    expect(clickAction).toHaveBeenCalled();
  });

  it('should display overwritten literals', async () => {
    const literals = {
      ...DEFAULT_LITERALS,
      callCenter: '963 387 999'
    };
    await renderComponent({ ...defaultArgs, literals });
    expect(screen.findByAltText('call center 963 387 999'));
  });
});
