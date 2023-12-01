import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import CartItemCard from './CartItemCard';

const closeBtnAction = jest.fn();
const changeQuantityAction = jest.fn();

describe('Cart Item Card', () => {
  const productMock = {
    lineItem: {
      id: 'id-01',
      brandName: 'Espíritu Gaucho',
      name: 'Yerba Mate con Palos Sabor Hierbas Serranas',
      unitSize: '350g',
      imageUrl:
        'https://8af79c1a06408d51955d-9a10b61716dda30af65ea3554b99e550.ssl.cf1.rackcdn.com/img-e-_YfJhI.png',
      price: '$8700',
      unitPrice: '$580',
      discount: '-25%',
      quantity: 2,
      sellUnit: 'Caja'
    },
    onDelete: closeBtnAction,
    onChangeQuantity: changeQuantityAction
  };
  const testId = 'adelco-cart-item-card';

  beforeEach(async () => {
    await act(async () => {
      render(<CartItemCard {...productMock} />);
    });
  });

  it('should render the component', () => {
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  it('should call delete fn', () => {
    const closeBtn = screen.getByTestId('icon-close');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(closeBtnAction).toHaveBeenCalled();
  });

  it('should call decrement fn', () => {
    const btn = screen.getByTestId('remove-button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(changeQuantityAction).toHaveBeenCalledWith('id-01', 1, 2);
  });

  it('should call increment fn', () => {
    const btn = screen.getByTestId('add-button');
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(changeQuantityAction).toHaveBeenCalledWith('id-01', 3, 2);
  });
});
