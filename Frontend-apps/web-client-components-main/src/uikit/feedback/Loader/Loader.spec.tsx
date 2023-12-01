import React from 'react';
import { screen, render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  test('renders with default label', () => {
    render(<Loader />);

    const loaderElement = screen.getByTestId('adelco-loader');
    expect(loaderElement).toBeInTheDocument();

    const labelElement = screen.getByText('Cargando...');
    expect(labelElement).toBeInTheDocument();
  });

  test('renders with custom label', () => {
    render(<Loader label="Custom Loading" />);

    const loaderElement = screen.getByTestId('adelco-loader');
    expect(loaderElement).toBeInTheDocument();

    const labelElement = screen.getByText('Custom Loading');
    expect(labelElement).toBeInTheDocument();
  });

  it('adds custom class to the Loader component', () => {
    render(<Loader className="custom-class" />);
    const loaderElement = screen.getByTestId('adelco-loader');
    expect(loaderElement).toHaveClass('custom-class');
  });

  test('renders with custom data-testid', () => {
    render(<Loader data-testid="custom-loader" />);

    const loaderElement = screen.getByTestId('custom-loader');
    expect(loaderElement).toBeInTheDocument();
  });
});
