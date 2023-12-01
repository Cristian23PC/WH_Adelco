import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import PDPCard from './PDPCard';

const mockProduct = {
  brandName: 'product brand',
  name: 'product name',
  imageUrl: 'https://via.placeholder.com/230',
  sku: 'number',
  calculatedPrice: '$8.700',
  unitPrice: '$430',
  packUnits: 20
};

describe('PDPCard', () => {
  it('Should render PDPCard', () => {
    render(<PDPCard onChangeProductAmount={() => {}} product={mockProduct} />);

    expect(screen.getByTestId('adelco-pdp-card')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByText('product brand')).toBeInTheDocument();
    expect(screen.getByText('product name')).toBeInTheDocument();
    expect(screen.getByText('SKU number')).toBeInTheDocument();
  });

  it('Should not render back button when onBack is not provided', () => {
    render(<PDPCard onChangeProductAmount={() => {}} product={mockProduct} />);

    expect(
      screen.queryByTestId('adelco-pdp-back-button')
    ).not.toBeInTheDocument();
  });

  it('Should execute function when onBack button is clicked', () => {
    const onBack = jest.fn();
    render(
      <PDPCard
        onChangeProductAmount={() => {}}
        product={mockProduct}
        onBack={onBack}
      />
    );

    const backBtn = screen.getByTestId('adelco-pdp-back-button');
    fireEvent.click(backBtn);

    expect(onBack).toHaveBeenCalled();
  });

  it('Should not render showPrices button when showPrice is true', () => {
    render(
      <PDPCard
        onChangeProductAmount={() => {}}
        product={mockProduct}
        showPrice
      />
    );

    expect(
      screen.queryByTestId('adelco-pdp-show-prices-button')
    ).not.toBeInTheDocument();
  });

  it('Should execute function when showPrices button is clicked', () => {
    const showPrices = jest.fn();
    render(
      <PDPCard
        onChangeProductAmount={() => {}}
        product={mockProduct}
        onShowPrices={showPrices}
      />
    );

    const showPricesBtn = screen.getByTestId('adelco-pdp-show-prices-button');
    fireEvent.click(showPricesBtn);

    expect(showPrices).toHaveBeenCalled();
  });

  it('Should render add button when showPrice is true', () => {
    render(
      <PDPCard
        onChangeProductAmount={() => {}}
        product={mockProduct}
        showPrice
      />
    );

    expect(screen.getByTestId('adelco-pdp-add-button')).toBeInTheDocument();
  });

  it('Should execute function when add button is clicked', () => {
    const onAdd = jest.fn();
    render(
      <PDPCard onChangeProductAmount={onAdd} product={mockProduct} showPrice />
    );

    const addBtn = screen.getByTestId('adelco-pdp-add-button');
    fireEvent.click(addBtn);

    expect(onAdd).toHaveBeenCalledWith(1);
  });

  it('Should not render price when showPrices is false', () => {
    render(<PDPCard onChangeProductAmount={() => {}} product={mockProduct} />);

    expect(screen.queryByText('adsf')).not.toBeInTheDocument();
  });

  it('Should render PDPCard with image', () => {
    render(<PDPCard onChangeProductAmount={() => {}} product={mockProduct} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', mockProduct.imageUrl);
    expect(image).toHaveAttribute('alt', mockProduct.brandName);
  });

  it('Should render PDPCard with price', () => {
    render(
      <PDPCard
        onChangeProductAmount={() => {}}
        product={mockProduct}
        showPrice
      />
    );

    expect(screen.getByText('$8.700')).toBeInTheDocument();
    expect(screen.getByText('$430/un')).toBeInTheDocument();
    expect(screen.getByText('x 20/un')).toBeInTheDocument();
  });

  it('Should render increment and decrement buttons when amountInCart is bigger than 0 and showPrice is true', async () => {
    await act(async () => {
      render(
        <PDPCard
          onChangeProductAmount={() => {}}
          product={mockProduct}
          amountInCart={1}
          showPrice
        />
      );
    });

    expect(screen.getByTestId('remove-button')).toBeInTheDocument();
    expect(screen.getByTestId('add-button')).toBeInTheDocument();
  });

  it('Should execute function when increment button is clicked', async () => {
    const onIncrement = jest.fn();
    await act(async () => {
      render(
        <PDPCard
          onChangeProductAmount={onIncrement}
          product={mockProduct}
          amountInCart={3}
          showPrice
        />
      );
    });

    const incrementBtn = screen.getByTestId('add-button');
    fireEvent.click(incrementBtn);

    expect(onIncrement).toHaveBeenCalledWith(4);
  });

  it('Should execute function when decrement button is clicked', async () => {
    const onDecrement = jest.fn();
    await act(async () => {
      render(
        <PDPCard
          onChangeProductAmount={onDecrement}
          product={mockProduct}
          amountInCart={3}
          showPrice
        />
      );
    });

    const decrementBtn = screen.getByTestId('remove-button');
    fireEvent.click(decrementBtn);

    expect(onDecrement).toHaveBeenCalledWith(2);
  });

  it('Should not execute function when loading is true', async () => {
    const onDecrement = jest.fn();
    const onIncrement = jest.fn();
    await act(async () => {
      render(
        <PDPCard
          onChangeProductAmount={onDecrement}
          product={mockProduct}
          amountInCart={3}
          showPrice
          loading={true}
        />
      );
    });

    const decrementBtn = screen.getByTestId('remove-button');
    fireEvent.click(decrementBtn);

    expect(onDecrement).not.toHaveBeenCalled();

    const incrementBtn = screen.getByTestId('add-button');
    fireEvent.click(incrementBtn);

    expect(onIncrement).not.toHaveBeenCalled();
  });

  it('Should render outOfStock button when product is outOfStock', () => {
    render(
      <PDPCard
        onChangeProductAmount={() => {}}
        product={{ ...mockProduct, outOfStock: true }}
        showPrice
      />
    );

    expect(screen.getByText('Agotado')).toBeInTheDocument();
  });

  it('Should render loading button', () => {
    render(
      <PDPCard
        onChangeProductAmount={() => {}}
        product={{ ...mockProduct, outOfStock: true }}
        showPrice
        loading={true}
      />
    );

    expect(screen.getByRole('button')?.querySelector('svg')).toHaveAttribute(
      'data-testid',
      'icon-spinner'
    );
  });
});
