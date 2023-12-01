import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import userEvent from '@testing-library/user-event';

describe('MenuItem Component', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <MenuItem
          label="Clientes"
          active={false}
          iconName="person_pin_circle"
          data-testid="test-menu-item"
        />
      );
    });
    expect(screen.getByTestId('test-menu-item')).toBeInTheDocument();
  });

  it('displays the correct label', async () => {
    await act(async () => {
      render(
        <MenuItem
          label="Clientes"
          active={false}
          iconName="person_pin_circle"
        />
      );
    });
    expect(screen.getByText('Clientes')).toBeInTheDocument();
  });

  it('displays the icon', async () => {
    await act(async () => {
      render(
        <MenuItem
          label="Clientes"
          active={false}
          iconName="person_pin_circle"
        />
      );
    });
    expect(screen.getByTestId('adelco-menu-item-icon')).toBeInTheDocument();
  });

  describe('MenuItem Component with options', () => {
    it('display the arrow icon', async () => {
      await act(async () => {
        render(
          <MenuItem
            label="Clientes"
            active={false}
            iconName="person_pin_circle"
          >
            <p>option 1</p>
            <p>option 2</p>
          </MenuItem>
        );
      });

      expect(
        screen.getByTestId('adelco-menu-item-arrow-icon')
      ).toBeInTheDocument();
    });

    it('display the options after click on the menu item', async () => {
      await act(async () => {
        render(
          <MenuItem
            label="Clientes"
            active={false}
            iconName="person_pin_circle"
            data-testid="test-menu-item"
          >
            <p>option 1</p>
            <p>option 2</p>
          </MenuItem>
        );
      });

      userEvent.click(screen.getByTestId('test-menu-item'));

      await waitFor(() => {
        expect(screen.getByText('option 1')).toBeInTheDocument();
        expect(screen.getByText('option 2')).toBeInTheDocument();
      });
    });

    it('display the options if the menu is active', async () => {
      await act(async () => {
        render(
          <MenuItem
            label="Clientes"
            active={true}
            iconName="person_pin_circle"
            data-testid="test-menu-item"
          >
            <p>option 1</p>
            <p>option 2</p>
          </MenuItem>
        );
      });

      expect(screen.getByText('option 1')).toBeInTheDocument();
      expect(screen.getByText('option 2')).toBeInTheDocument();
    });
  });
});
