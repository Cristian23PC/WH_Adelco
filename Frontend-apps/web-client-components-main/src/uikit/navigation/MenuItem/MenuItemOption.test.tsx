import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import userEvent from '@testing-library/user-event';
import MenuItemOption from './MenuItemOption';

describe('MenuItemOption Component', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <MenuItemOption
          label="Clientes"
          active={false}
          data-testid="test-menu-item-option"
        />
      );
    });
    expect(screen.getByTestId('test-menu-item-option')).toBeInTheDocument();
  });

  it('displays the correct label', async () => {
    await act(async () => {
      render(<MenuItemOption label="Clientes" active={true} />);
    });
    expect(screen.getByText('Clientes')).toBeInTheDocument();
  });

  it('call onClick function', async () => {
    const mockOnClick = jest.fn();
    await act(async () => {
      render(
        <MenuItemOption
          label="Clientes"
          active={false}
          data-testid="test-menu-item-option"
          onClick={mockOnClick}
        />
      );
    });

    userEvent.click(screen.getByTestId('test-menu-item-option'));

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
