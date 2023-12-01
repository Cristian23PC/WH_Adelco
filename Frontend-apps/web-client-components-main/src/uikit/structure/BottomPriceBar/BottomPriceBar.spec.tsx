import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import BottomPriceBar from './BottomPriceBar';

const submitAction = jest.fn();

describe('Bottom Price Bar', () => {
  it('should render the component', () => {
    render(<BottomPriceBar totalPrice="$22.700" onSubmit={submitAction} />);
    expect(screen.getByTestId('adelco-bottom-price-bar')).toBeInTheDocument();
  });
  it('should call the submit fn', () => {
    render(<BottomPriceBar totalPrice="$22.700" onSubmit={submitAction} />);
    fireEvent.click(screen.getByRole('button'));
    expect(submitAction).toHaveBeenCalled();
  });
  it('should render the button disabled', () => {
    render(
      <BottomPriceBar
        totalPrice="$22.700"
        onSubmit={submitAction}
        createOrderDisabled={true}
      />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('disabled');
  });
});
