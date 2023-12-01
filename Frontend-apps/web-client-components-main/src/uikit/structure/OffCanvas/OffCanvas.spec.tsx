import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import OffCanvas from './OffCanvas';

describe('OffCanvas', () => {
  it('should render', () => {
    render(<OffCanvas show={true}>offcanvas body</OffCanvas>);

    const offcanvas = screen.getByTestId('adelco-offcanvas');
    expect(offcanvas).toBeInTheDocument();
    expect(offcanvas).toHaveClass(
      'z-60 fixed top-0 bottom-0 h-auto whitespace-nowrap'
    );
    expect(screen.getByText(/offcanvas body/)).toBeInTheDocument();
  });

  it('Should render backdrop', () => {
    render(<OffCanvas show={true} />);

    expect(screen.getByTestId('adelco-backdrop')).toBeInTheDocument();
  });

  it('Should hide when show property is false', () => {
    render(<OffCanvas show={false} />);

    const offcanvas = screen.queryByTestId('adelco-offcanvas');
    expect(offcanvas).not.toBeInTheDocument();
  });

  it('Should render with left placement', () => {
    render(<OffCanvas show placement="left" />);

    const offcanvas = screen.getByTestId('adelco-offcanvas');
    expect(offcanvas).toHaveClass('left-0 w-[279px] tablet:w-[258px]');
  });

  it('Should render with right placement', () => {
    render(<OffCanvas show placement="right" />);

    const offcanvas = screen.getByTestId('adelco-offcanvas');
    expect(offcanvas).toHaveClass('right-0 w-[286px] tablet:w-[300px]');
  });

  it('Should hide overflow when show property change from true to false', async () => {
    const { rerender } = render(<OffCanvas show={true} />);

    const offcanvas = screen.getByTestId('adelco-offcanvas');
    expect(offcanvas).toBeInTheDocument();

    rerender(<OffCanvas show={false} />);

    await waitFor(() => {
      expect(offcanvas).not.toBeInTheDocument();
    });
  });

  describe('When is child', () => {
    it('Should not render backdrop', () => {
      render(<OffCanvas show isChild />);

      expect(screen.queryByTestId('adelco-backdrop')).not.toBeInTheDocument();
    });

    it('Should render with left placement', () => {
      render(<OffCanvas show placement="left" isChild />);

      const offcanvas = screen.getByTestId('adelco-offcanvas');
      expect(offcanvas).toHaveClass('left-0 tablet:left-[258px]');
    });

    it('Should render with right placement', () => {
      render(<OffCanvas show placement="right" isChild />);

      const offcanvas = screen.getByTestId('adelco-offcanvas');
      expect(offcanvas).toHaveClass('right-0 tablet:right-[300px]');
    });
  });
});
