import React from 'react';
import { screen, render, act } from '@testing-library/react';
import CheckoutFeedback, { type Props } from './CheckoutFeedback';

describe('Checkout Feedback component', () => {
  const renderComponent = async (args: Props): Promise<void> => {
    await act(async () => {
      render(<CheckoutFeedback {...args} />);
    });
  };
  const testId = 'adelco-checkout-feedback';

  it('renders component with default variant', async () => {
    await renderComponent({
      title: 'Despacho gratis',
      message: 'Monto mínimo de compra $50.000'
    });

    const component = screen.getByTestId(testId);
    expect(component).toBeInTheDocument();
    expect(component).toHaveClass('bg-corporative-01');

    const icon = screen.getByTestId('icon-delivery');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '24');
    expect(icon).toHaveClass('fill-black');
  });

  it('renders the success variant', async () => {
    await renderComponent({ message: 'Despacho gratis', variant: 'success' });
    expect(screen.getByTestId(testId)).toHaveClass('text-success');

    const icon = screen.getByTestId('icon-done');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveClass('fill-success');
  });

  it('renders the error variant', async () => {
    await renderComponent({
      message: 'Aún no cumples el monto mínimo decompra ($50.000)',
      variant: 'error'
    });
    expect(screen.getByTestId(testId)).toHaveClass('border-failure');

    const icon = screen.getByTestId('icon-delivery');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('width', '16');
    expect(icon).toHaveClass('fill-white');
  });
});
