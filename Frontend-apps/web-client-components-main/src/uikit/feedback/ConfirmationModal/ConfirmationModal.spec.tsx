import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import ConfirmationModal, { DEFAULT_LITERALS } from './ConfirmationModal';

const cancelAction = jest.fn();
const confirmAction = jest.fn();

describe('Confirmation Modal', () => {
  const msg = '¿Estás seguro de vaciar tu carro?';
  const confirmLabel = 'Vaciar carrito';

  const renderComponent = async (): Promise<void> => {
    await act(async () => {
      render(
        <ConfirmationModal
          onClose={cancelAction}
          onSubmit={confirmAction}
          message={msg}
          literals={{
            ...DEFAULT_LITERALS,
            confirmButtonLabel: confirmLabel
          }}
          open={true}
        />
      );
    });
  };

  it('should render the component', async () => {
    await renderComponent();
    expect(screen.getByText(msg)).toBeInTheDocument();
  });

  it('should call the confirm fn', async () => {
    await renderComponent();
    const btn = screen.getByText(confirmLabel);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(confirmAction).toHaveBeenCalled();
  });

  it('should call the cancel fn', async () => {
    await renderComponent();
    const btn = screen.getByText(DEFAULT_LITERALS.cancelButtonLabel);
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(cancelAction).toHaveBeenCalled();
  });

  it('should not render the component if open prop is false', () => {
    render(
      <ConfirmationModal
        onClose={cancelAction}
        onSubmit={confirmAction}
        message={msg}
        literals={{
          ...DEFAULT_LITERALS,
          confirmButtonLabel: confirmLabel
        }}
      />
    );
    expect(screen.queryByText(msg)).not.toBeInTheDocument();
  });

  it('should render icon has different size if mobile prop is true', async () => {
    await act(async () => {
      render(
        <ConfirmationModal
          onClose={cancelAction}
          onSubmit={confirmAction}
          message={msg}
          literals={{
            ...DEFAULT_LITERALS,
            confirmButtonLabel: confirmLabel
          }}
          open={true}
          isMobile={true}
        />
      );
    });

    const errorIcon = screen.getByTestId('icon-error');
    expect(errorIcon.getAttribute('width')).toBe('50');
  });
});
