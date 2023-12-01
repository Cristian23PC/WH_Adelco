import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CartUpdateModal from './CartUpdateModal';

const onContinueMock = jest.fn();
const onDeclineMock = jest.fn();

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  onContinue: onContinueMock,
  onDecline: onDeclineMock
};

describe('CartUpdateModal', () => {
  it('should render CartUpdateModal with default props', () => {
    render(<CartUpdateModal {...defaultProps} />);

    expect(screen.getByTestId('adelco-cart-update-modal')).toBeInTheDocument();
    expect(screen.getByText('Actualización')).toBeInTheDocument();
    expect(screen.getByText('Aceptar')).toBeInTheDocument();
  });

  it('should render CartUpdateModal with custom props', () => {
    const customProps = {
      ...defaultProps,
      literals: {
        title: 'Custom Title',
        descriptions: ['Custom Description'],
        continueButtonLabel: 'Custom Label'
      }
    };
    render(<CartUpdateModal {...customProps} />);

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  it('should call onContinue when the continue button is clicked', () => {
    render(<CartUpdateModal {...defaultProps} />);

    const continueButton = screen.getByTestId(
      'adelco-cart-update-modal-continue-button'
    );
    userEvent.click(continueButton);

    expect(onContinueMock).toHaveBeenCalledTimes(1);
  });

  it('should call onDecline when the decline button is clicked', () => {
    const customProps = {
      ...defaultProps,
      literals: {
        declineButtonLabel: 'Decline'
      }
    };
    render(<CartUpdateModal {...customProps} />);

    const declineButton = screen.getByTestId(
      'adelco-cart-update-modal-decline-button'
    );
    userEvent.click(declineButton);

    expect(onDeclineMock).toHaveBeenCalledTimes(1);
  });

  it('should not render buttons when the labels are empty', () => {
    const customProps = {
      ...defaultProps,
      literals: {
        declineButtonLabel: '',
        continueButtonLabel: ''
      }
    };
    render(<CartUpdateModal {...customProps} />);

    expect(
      screen.queryByTestId('adelco-cart-update-modal-decline-button')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId('adelco-cart-update-modal-continue-button')
    ).not.toBeInTheDocument();
  });
});
