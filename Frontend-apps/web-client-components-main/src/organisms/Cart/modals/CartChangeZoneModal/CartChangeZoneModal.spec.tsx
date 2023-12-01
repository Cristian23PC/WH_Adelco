import React from 'react';
import { render, screen } from '@testing-library/react';
import CartChangeZoneModal from './CartChangeZoneModal';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onContinue: jest.fn(),
  onDecline: jest.fn()
};

describe('CartChangeZoneModal', () => {
  it('should render CartChangeZoneModal with default props', () => {
    render(<CartChangeZoneModal {...defaultProps} />);

    expect(
      screen.getByTestId('adelco-cart-change-zone-modal')
    ).toBeInTheDocument();
    expect(screen.getByText('Actualización')).toBeInTheDocument();
    expect(screen.getByText('Mantener ubicación')).toBeInTheDocument();
    expect(screen.getByText('Cambiar ubicación')).toBeInTheDocument();
  });
});
