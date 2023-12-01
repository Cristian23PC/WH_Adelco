import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Backdrop from './Backdrop';

describe('Backdrop', () => {
  it('should render the component', () => {
    render(<Backdrop show={true} />);
    expect(screen.getByTestId('adelco-backdrop')).toBeInTheDocument();
  });

  it('should change the z-index using the className prop to overwrite the att', () => {
    render(<Backdrop show={true} className="z-50" />);
    const backdropElement = screen.getByTestId('adelco-backdrop');
    expect(backdropElement).toHaveClass('z-50');
  });

  it('Should not render the component without show prop ', () => {
    render(<Backdrop />);
    expect(screen.queryByTestId('adelco-backdrop')).not.toBeInTheDocument();
  });
});
