import React, { type FC } from 'react';
import {
  render,
  screen,
  act,
  fireEvent,
  waitFor
} from '@testing-library/react';
import QuantitySelector, {
  type QuantitySelectorProps
} from './QuantitySelector';
import userEvent from '@testing-library/user-event';

const Component: FC<Partial<QuantitySelectorProps>> = (props) => (
  <QuantitySelector quantity={2} onChange={jest.fn()} {...props} />
);
jest.useFakeTimers();

describe('QuantitySelector', () => {
  describe('renderer', () => {
    it('should display quantity', async () => {
      const quantity = 5;
      await act(async () => {
        render(<Component quantity={quantity} />);
      });

      expect(screen.getByRole('textbox')).toHaveValue(quantity.toString());
    });
  });

  describe('actions', () => {
    describe('buttons', () => {
      it('should call onChange when press on increment button', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(<Component onChange={onChangeSpy} />);
        });

        fireEvent.click(screen.getByTestId('add-button'));

        expect(onChangeSpy).toHaveBeenCalledWith(3);
      });

      it('should call onChange when press on decrement button', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(<Component onChange={onChangeSpy} />);
        });

        fireEvent.click(screen.getByTestId('remove-button'));

        expect(onChangeSpy).toHaveBeenCalledWith(1);
      });

      it('should not call onChange when press on decrement button and quantity is 0', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(<Component onChange={onChangeSpy} quantity={0} />);
        });

        const removeButton = screen.getByTestId('remove-button');

        fireEvent.click(removeButton);

        expect(onChangeSpy).not.toHaveBeenCalled();
        expect(removeButton).toHaveProperty('disabled', true);
      });

      it('should not call onChange when press on increment button and quantity is equal to availabilityQuantity', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(
            <Component
              onChange={onChangeSpy}
              quantity={20}
              availableQuantity={20}
            />
          );
        });

        const addButton = screen.getByTestId('add-button');

        fireEvent.click(addButton);

        expect(onChangeSpy).not.toHaveBeenCalled();
        expect(addButton).toHaveProperty('disabled', true);
      });

      it('should not call onChange when press on increment button and loading prop is true', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(
            <Component
              onChange={onChangeSpy}
              quantity={2}
              availableQuantity={20}
              loading={true}
            />
          );
        });

        const addButton = screen.getByTestId('add-button');

        fireEvent.click(addButton);

        expect(onChangeSpy).not.toHaveBeenCalled();
        const spinnerIcon = screen.getByTestId('icon-spinner');
        expect(spinnerIcon).toBeInTheDocument();
      });
    });

    describe('input change', () => {
      it('should call onChange on blur input if quantity is different from input value', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(<Component onChange={onChangeSpy} quantity={5} />);
        });

        const quantityInput = screen.getByRole('textbox');

        userEvent.clear(quantityInput);
        userEvent.type(quantityInput, '3');
        userEvent.tab();

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(3);
      });

      it("should call onChange on press enter input if quantity is different from input's value", async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(<Component onChange={onChangeSpy} quantity={5} />);
        });

        const quantityInput = screen.getByRole('textbox');

        userEvent.clear(quantityInput);
        userEvent.type(quantityInput, '3');
        userEvent.keyboard('{enter}');

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(3);
      });

      it('should not call onChange on blur input if quantity is equal to input value', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(<Component onChange={onChangeSpy} quantity={5} />);
        });

        const quantityInput = screen.getByRole('textbox');

        userEvent.clear(quantityInput);
        userEvent.type(quantityInput, '5');
        act(() => {
          jest.advanceTimersByTime(2000);
        });

        expect(onChangeSpy).not.toHaveBeenCalled();
      });

      it('should call onChange with availableQuantity and show a warning tooltip on blur when input values is higher than availableQuantity', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(
            <Component
              onChange={onChangeSpy}
              quantity={5}
              availableQuantity={10}
            />
          );
        });

        const quantityInput = screen.getByRole('textbox');

        userEvent.clear(quantityInput);
        userEvent.type(quantityInput, '78');
        userEvent.keyboard('{enter}');

        const tooltip = await screen.findByText('Máximo de stock alcanzado');

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(10);
        expect(tooltip).toBeInTheDocument();

        jest.runOnlyPendingTimers();

        await waitFor(() => {
          expect(tooltip).not.toBeInTheDocument(); // disappears after 3 seconds
        });
      });

      it('should call onChange with 0 when input value is empty', async () => {
        const onChangeSpy = jest.fn();
        await act(async () => {
          render(<Component onChange={onChangeSpy} quantity={5} />);
        });

        const quantityInput = screen.getByRole('textbox');

        userEvent.clear(quantityInput);
        userEvent.keyboard('{enter}');

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(0);
      });

      it('should update input quantity and show stock warning modal if onChange response is an error', async () => {
        const onChangeSpy = jest.fn().mockReturnValue({
          error: true,
          quantity: 8,
          showStockWarning: true
        });

        await act(async () => {
          render(<Component onChange={onChangeSpy} quantity={5} />);
        });

        const quantityInput = screen.getByRole('textbox');

        userEvent.clear(quantityInput);
        userEvent.type(quantityInput, '3');
        userEvent.keyboard('{enter}');

        expect(onChangeSpy).toHaveBeenCalledTimes(1);
        expect(onChangeSpy).toHaveBeenCalledWith(3);

        await waitFor(() => {
          expect(quantityInput).toHaveValue('8');
          expect(
            screen.getByText('Máximo de stock alcanzado')
          ).toBeInTheDocument();
        });
      });
    });
  });
});
