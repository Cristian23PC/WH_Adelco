import React, { type FC } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastComponent, type ToastComponentProps } from './Toast';
import { toast as hotToast } from 'react-hot-toast';

const mockRemove = jest.fn();

const mockToast: any = {
  id: 'mock-toast-id',
  visible: true
};

const Component: FC<Partial<ToastComponentProps>> = (overwrite) => (
  <ToastComponent
    title="Test Title"
    text="Test Text"
    type="success"
    t={mockToast}
    {...overwrite}
  />
);

describe('ToastComponent', () => {
  beforeEach(() => {
    hotToast.remove = mockRemove;
  });

  it('renders the component without errors', () => {
    render(<Component />);
    expect(screen.getByTestId('adelco-toast')).toBeInTheDocument();
  });

  it('displays the title and text correctly', () => {
    render(<Component />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Text')).toBeInTheDocument();
  });

  it('renders an icon if iconName is present', async () => {
    await act(async () => {
      render(<Component iconName="wifi_offline" />);
    });

    expect(screen.getByTestId('adelco-toast-icon')).toBeInTheDocument();
  });

  it('calls remove function when close icon is clicked', () => {
    render(<Component />);
    const closeIcon = screen.getByTestId('adelco-toast-close-icon');
    fireEvent.click(closeIcon);
    expect(hotToast.remove).toHaveBeenCalledWith('mock-toast-id');
  });

  describe('applies the correct background class based on the toast type', () => {
    it('success', () => {
      render(<Component type="success" />);
      expect(screen.getByTestId('adelco-toast')).toHaveClass(
        'bg-success-light'
      );
    });
    it('warning', () => {
      render(<Component type="warning" />);
      expect(screen.getByTestId('adelco-toast')).toHaveClass(
        'bg-warning-light'
      );
    });

    it('error', () => {
      render(<Component type="failure" />);
      expect(screen.getByTestId('adelco-toast')).toHaveClass(
        'bg-failure-light'
      );
    });
  });
});
