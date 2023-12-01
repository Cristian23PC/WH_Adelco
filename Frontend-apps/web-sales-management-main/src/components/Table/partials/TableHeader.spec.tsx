import { render, screen, act } from '@testing-library/react';
import TableHeader, { TableHeaderProps } from './TableHeader';
import React from 'react';

describe('TableHeader', () => {
  it('renders the header labels correctly', async () => {
    const labels = ['Header 1', 'Header 2', 'Header 3'];

    await act(async () => {
      render(<TableHeader headerLabels={labels} />);
    });

    labels.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it('applies the correct grid class based on the number of labels', async () => {
    const labels = ['Header 1', 'Header 2', 'Header 3'];

    await act(async () => {
      render(<TableHeader headerLabels={labels} />);
    });

    const ulElement = screen.getByRole('list');
    expect(ulElement).toHaveClass('grid-cols-3');
  });

  it('renders nothing when no labels are provided', async () => {
    await act(async () => {
      render(<TableHeader />);
    });

    const ulElement = screen.getByRole('list');
    expect(ulElement).toBeEmptyDOMElement();
  });
});
