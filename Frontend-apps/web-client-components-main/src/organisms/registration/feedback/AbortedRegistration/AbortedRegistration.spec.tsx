import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import AbortedRegistration, {
  type Props,
  DEFAULT_LITERALS,
  type BenefitType
} from './AbortedRegistration';

const keepAsGuestAction = jest.fn();
const backToSignUpAction = jest.fn();

const benefits: BenefitType[] = [
  {
    iconName: 'sales_outline',
    message: 'Podrás ver precios personalizados para tu negocio'
  },
  {
    iconName: 'delivery',
    message: 'Despacho gratis al comprar sobre nuestro pedido mínimo'
  },
  {
    iconName: 'customized_atention',
    message: 'Atención personalizada por parte de nuestro equipo de ventas'
  }
];
const defaultArgs = {
  benefits,
  onKeepAsGuest: keepAsGuestAction,
  onBackToSignUp: backToSignUpAction
};

const renderComponent = async (args: Props): Promise<void> => {
  await act(async () => {
    render(<AbortedRegistration {...args} />);
  });
};

describe('AbortedRegistraion component', () => {
  it('should render the component', async () => {
    await renderComponent(defaultArgs);
    expect(screen.getByTestId('aborted-registration'));
  });

  it('should call the keepAsGuest action', async () => {
    await renderComponent(defaultArgs);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(keepAsGuestAction).toHaveBeenCalled();
  });

  it('should call the keepAsGuest action', async () => {
    await renderComponent(defaultArgs);
    fireEvent.click(screen.getAllByRole('button')[1]);
    expect(backToSignUpAction).toHaveBeenCalled();
  });

  it('should render 3 benefits', async () => {
    await renderComponent(defaultArgs);
    const benefitElements = screen.getAllByTestId('registration-benefit');
    expect(benefitElements.length).toBe(3);
  });

  it('should display overwritten literals', async () => {
    const mockText = 'Benefits Title';
    const literals = {
      ...DEFAULT_LITERALS,
      benefitsTitle: mockText
    };
    await renderComponent({ ...defaultArgs, literals });
    expect(screen.findByAltText(mockText));
  });
});
