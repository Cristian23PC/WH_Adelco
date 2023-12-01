import React from 'react';
import { screen, render } from '@testing-library/react';
import Spinner from './Spinner';
describe('Spinner', () => {
  it('renders the Spinner component', () => {
    render(<Spinner />);
    const spinnerElement = screen.getByTestId('adelco-spinner');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('adds custom class to the Spinner component', () => {
    render(<Spinner className="custom-class" />);
    const spinnerElement = screen.getByTestId('adelco-spinner');
    expect(spinnerElement).toHaveClass('custom-class');
  });

  it('renders with custom data-testid', () => {
    render(<Spinner data-testid="custom-loader" />);

    const spinnerElement = screen.getByTestId('custom-loader');
    expect(spinnerElement).toBeInTheDocument();
  });

  it('Should render white isotype when backdropColor is black', async () => {
    render(<Spinner backdropColor="black" />);

    const logoElement = await screen.findByTestId('white-isotype');
    expect(logoElement).toBeInTheDocument();
  });

  it('Should render corporative isotype when backdropColor is white', async () => {
    render(<Spinner backdropColor="white" />);

    const logoElement = await screen.findByTestId('corporative-isotype');
    expect(logoElement).toBeInTheDocument();
  });

  it('Should render with backdrop opacity 50%', () => {
    render(<Spinner opacity="50" />);

    const backdropElement = screen.getByTestId('adelco-spinner-backdrop');
    expect(backdropElement).toHaveStyle('opacity: 0.5');
  });

  it('Should render with backdrop opacity 1%', () => {
    render(<Spinner opacity="1" />);

    const backdropElement = screen.getByTestId('adelco-spinner-backdrop');
    expect(backdropElement).toHaveStyle('opacity: 0.01');
  });

  it('Should render with backdrop opacity 100%', () => {
    render(<Spinner opacity="100" />);

    const backdropElement = screen.getByTestId('adelco-spinner-backdrop');
    expect(backdropElement).toHaveStyle('opacity: 1');
  });
});
