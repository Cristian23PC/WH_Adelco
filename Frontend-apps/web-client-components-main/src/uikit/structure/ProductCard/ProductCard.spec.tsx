import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';
import { act } from 'react-dom/test-utils';
import { type LinkRenderer } from '../../../utils/types';

const mockLinkRenderer: LinkRenderer = (link, label, target) => (
  <a data-testid="link-rendered" href={link} target={target}>
    {label}
  </a>
);

describe('Product Card', () => {
  const brandName = 'Product Brand';
  const name = 'Product Name';
  const price = '$8700';
  const unitPrice = '$543';
  const calculatedPrice = '$6525';
  const unitSize = '350g';
  const sellUnit = 'display';
  const discount = '-25%';
  const imgUrl =
    'https://images.pexels.com/photos/4195527/pexels-photo-4195527.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
  const testId = 'adelco-product-card';
  const btnLabelAddToCart = 'Agregar';
  const btnLabelSeePrices = 'Ver Precios';
  const btnLabelOutOfStock = 'Agotado';
  const clickAction = jest.fn();

  describe('User did not indicate location', () => {
    const btnAction = jest.fn();
    beforeEach(() => {
      render(
        <ProductCard
          linkRenderer={mockLinkRenderer}
          productUrl="/path"
          brandName={brandName}
          name={name}
          imageUrl={imgUrl}
          price={price}
          calculatedPrice={calculatedPrice}
          unitPrice={unitPrice}
          unitSize={unitSize}
          sellUnit={sellUnit}
          discount={discount}
          showPrices={false}
          onSeePrices={btnAction}
          onClick={clickAction}
        />
      );
    });
    it('should render the component without prices', () => {
      const card = screen.queryByTestId(testId);
      expect(card).toBeInTheDocument();
      const priceElement = screen.queryByText(price);
      expect(priceElement).not.toBeInTheDocument();
      const unitPriceElement = screen.queryByText(unitPrice);
      expect(unitPriceElement).not.toBeInTheDocument();
    });
    it('should render the correct button', () => {
      const btn = screen.queryAllByTestId('adelco-button');
      expect(btn[0]).toBeInTheDocument();
      expect(btn[0]).toHaveClass('tablet:hidden');
      expect(btn[1]).toHaveClass('hidden');
      const correctLabel = btn[0].querySelector('span')?.textContent;
      expect(correctLabel).toEqual('Ver Precios');
      const btnLabelAddToCart = screen.queryByText('Agregar');
      expect(btnLabelAddToCart).not.toBeInTheDocument();
      const btnLabelOutOfStock = screen.queryByText('Agotado');
      expect(btnLabelOutOfStock).not.toBeInTheDocument();
    });
    it('should not render discount info', () => {
      const badge = screen.queryByTestId('adelco-badge');
      expect(badge).not.toBeInTheDocument();
      const discountText = screen.queryByText(discount);
      expect(discountText).not.toBeInTheDocument();
    });
    it('should call actions', () => {
      const btn = screen.queryAllByTestId('adelco-button');
      fireEvent.click(btn[0]);
      expect(btnAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('User indicated location but product is out of stock', () => {
    const btnAction = jest.fn();
    beforeEach(() => {
      render(
        <ProductCard
          linkRenderer={mockLinkRenderer}
          productUrl="/path"
          brandName={brandName}
          name={name}
          imageUrl={imgUrl}
          price={price}
          calculatedPrice={calculatedPrice}
          unitPrice={unitPrice}
          sellUnit={sellUnit}
          showPrices={true}
          discount={discount}
          btnLabelAddToCart={btnLabelAddToCart}
          btnLabelSeePrices={btnLabelSeePrices}
          btnLabelOutOfStock={btnLabelOutOfStock}
          outOfStock
          onAddToCart={btnAction}
        />
      );
    });
    it('should render the component with correct classes', () => {
      const button = screen.queryAllByRole('button')[0];
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('disabled');
    });
    it('should display discount and prices', () => {
      const priceElement = screen.queryByText(calculatedPrice);
      expect(priceElement).toBeInTheDocument();
      const badge = screen.queryByTestId('adelco-badge');
      expect(badge).toBeInTheDocument();
      const discountText = screen.queryByText(discount);
      expect(discountText).toBeInTheDocument();
      const totalPrice = screen.queryByText(price);
      expect(totalPrice).toBeInTheDocument();
      expect(totalPrice).toHaveClass('line-through');
    });
    it('should not render unitSize prop', () => {
      const unitSizeElement = screen.queryByText(unitSize);
      expect(unitSizeElement).not.toBeInTheDocument();
    });
    it('should render the correct button', () => {
      const btn = screen.queryAllByTestId('adelco-button');
      expect(btn[0]).toBeInTheDocument();
      expect(btn[0]).toHaveClass('tablet:hidden');
      expect(btn[1]).toHaveClass('hidden');
      const correctLabel = btn[0].querySelector('span')?.textContent;
      expect(correctLabel).toEqual('Agotado');
      const btnLabelAddToCart = screen.queryByText('Agregar');
      expect(btnLabelAddToCart).not.toBeInTheDocument();
      const btnLabelSeePrices = screen.queryByText('Ver Precios');
      expect(btnLabelSeePrices).not.toBeInTheDocument();
    });
    it('should call action', () => {
      const btn = screen.queryAllByTestId('adelco-button');
      fireEvent.click(btn[0]);
      expect(btnAction).toHaveBeenCalledTimes(0);
    });
  });

  describe('Product has no price set', () => {
    it('should render the correct button', () => {
      render(
        <ProductCard
          linkRenderer={mockLinkRenderer}
          productUrl="/path"
          brandName={brandName}
          name={name}
          imageUrl={imgUrl}
          sellUnit={sellUnit}
          showPrices={true}
          btnLabelAddToCart={btnLabelAddToCart}
          btnLabelSeePrices={btnLabelSeePrices}
          btnLabelOutOfStock={btnLabelOutOfStock}
          onAddToCart={() => {}}
        />
      );
      const btn = screen.queryAllByTestId('adelco-button');
      expect(btn[0]).toBeInTheDocument();
      expect(btn[0]).toHaveClass('tablet:hidden');
      expect(btn[1]).toHaveClass('hidden');
      const correctLabel = btn[0].querySelector('span')?.textContent;
      expect(correctLabel).toEqual('Agotado');
      const addToCartLabel = screen.queryByText('Agregar');
      expect(addToCartLabel).not.toBeInTheDocument();
      const seePricesLabel = screen.queryByText('Ver Precios');
      expect(seePricesLabel).not.toBeInTheDocument();
    });
  });

  describe('User indicated location and product has no discount', () => {
    beforeEach(() => {
      render(
        <ProductCard
          linkRenderer={mockLinkRenderer}
          productUrl="/path"
          brandName={brandName}
          name={name}
          imageUrl={imgUrl}
          price={price}
          calculatedPrice={calculatedPrice}
          unitPrice={unitPrice}
          sellUnit={sellUnit}
          unitSize={unitSize}
          btnLabelAddToCart={btnLabelAddToCart}
          btnLabelSeePrices={btnLabelSeePrices}
          btnLabelOutOfStock={btnLabelOutOfStock}
          showPrices={true}
        />
      );
    });
    it('should display prices and no discount components', () => {
      const priceElement = screen.queryByText(calculatedPrice);
      expect(priceElement).toBeInTheDocument();
      const badge = screen.queryByTestId('adelco-badge');
      expect(badge).not.toBeInTheDocument();
      const discountText = screen.queryByText(discount);
      expect(discountText).not.toBeInTheDocument();
      const totalPrice = screen.queryByText(price);
      expect(totalPrice).not.toBeInTheDocument();
    });
    it('should render the correct button', () => {
      const btn = screen.queryAllByTestId('adelco-button');
      expect(btn[0]).toBeInTheDocument();
      expect(btn[0]).toHaveClass('tablet:hidden');
      expect(btn[1]).toHaveClass('hidden');
      const correctLabel = btn[0].querySelector('span')?.textContent;
      expect(correctLabel).toEqual('Agregar');
      const btnLabelOutOfStock = screen.queryByText('Agotado');
      expect(btnLabelOutOfStock).not.toBeInTheDocument();
      const btnLabelSeePrices = screen.queryByText('Ver Precios');
      expect(btnLabelSeePrices).not.toBeInTheDocument();
    });
  });

  describe('user indicated location and product is alredy in cart', () => {
    const onChangeFn = jest.fn();

    describe('with 2 units', () => {
      beforeEach(async () => {
        await act(() =>
          render(
            <ProductCard
              linkRenderer={mockLinkRenderer}
              productUrl="/path"
              brandName={brandName}
              name={name}
              imageUrl={imgUrl}
              price={price}
              calculatedPrice={calculatedPrice}
              unitPrice={unitPrice}
              unitSize={unitSize}
              sellUnit={sellUnit}
              showPrices={true}
              discount={discount}
              btnLabelAddToCart={btnLabelAddToCart}
              btnLabelSeePrices={btnLabelSeePrices}
              btnLabelOutOfStock={btnLabelOutOfStock}
              isInCart
              units={2}
              onChange={onChangeFn}
            />
          )
        );
      });

      it('should call to actions correctly', async () => {
        const incrementButton = screen.getByTestId('add-button');
        const decrementButton = screen.getByTestId('remove-button');

        fireEvent.click(incrementButton);
        expect(onChangeFn).toHaveBeenCalledWith(3);

        fireEvent.click(decrementButton);
        expect(onChangeFn).toHaveBeenCalledWith(3);
      });
    });

    describe('with 1 units', () => {
      beforeEach(async () => {
        await act(() =>
          render(
            <ProductCard
              linkRenderer={mockLinkRenderer}
              productUrl="/path"
              brandName={brandName}
              name={name}
              imageUrl={imgUrl}
              price={price}
              calculatedPrice={calculatedPrice}
              unitPrice={unitPrice}
              unitSize={unitSize}
              sellUnit={sellUnit}
              showPrices={true}
              discount={discount}
              btnLabelAddToCart={btnLabelAddToCart}
              btnLabelSeePrices={btnLabelSeePrices}
              btnLabelOutOfStock={btnLabelOutOfStock}
              isInCart
              units={1}
              onChange={onChangeFn}
            />
          )
        );
      });

      it('should not call onChange if decrement units', async () => {
        fireEvent.click(screen.getByTestId('remove-button'));
        onChangeFn.mockClear();
        await act(async () => {
          expect(onChangeFn).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('It should display a spinner and not call to action when loading', () => {
    describe('With 2 units in cart', () => {
      beforeEach(async () => {
        await act(() =>
          render(
            <ProductCard
              linkRenderer={mockLinkRenderer}
              productUrl="/path"
              brandName={brandName}
              name={name}
              imageUrl={imgUrl}
              price={price}
              calculatedPrice={calculatedPrice}
              unitPrice={unitPrice}
              unitSize={unitSize}
              sellUnit={sellUnit}
              showPrices={true}
              loading={true}
              discount={discount}
              btnLabelAddToCart={btnLabelAddToCart}
              btnLabelSeePrices={btnLabelSeePrices}
              btnLabelOutOfStock={btnLabelOutOfStock}
              isInCart
              units={2}
            />
          )
        );
      });

      it('should display a spinner', () => {
        const spinnerIcon = screen.getByTestId('icon-spinner');
        expect(spinnerIcon).toBeInTheDocument();
      });
    });

    describe('Not in cart', () => {
      const btnAction = jest.fn();
      beforeEach(() => {
        render(
          <ProductCard
            linkRenderer={mockLinkRenderer}
            productUrl="/path"
            brandName={brandName}
            name={name}
            imageUrl={imgUrl}
            price={price}
            calculatedPrice={calculatedPrice}
            unitPrice={unitPrice}
            unitSize={unitSize}
            sellUnit={sellUnit}
            discount={discount}
            showPrices={false}
            onSeePrices={btnAction}
            onClick={clickAction}
            loading={true}
          />
        );
      });
      it('should display a spinner inside the action button', () => {
        const btn = screen.queryAllByTestId('adelco-button');
        expect(btn[0]).toBeInTheDocument();
        const icon = btn[0].querySelector('svg');
        expect(icon).toHaveAttribute('data-testid', 'icon-spinner');
      });
      it('should not call to action', () => {
        const btn = screen.queryAllByTestId('adelco-button');
        fireEvent.click(btn[0]);
        expect(btnAction).not.toHaveBeenCalled();
      });
    });
  });
});
