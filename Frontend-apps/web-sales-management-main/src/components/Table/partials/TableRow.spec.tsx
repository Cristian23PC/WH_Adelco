import React from 'react';
import { render, screen, act } from '@testing-library/react';
import TableRow, { TableRowProps } from './TableRow';

describe('TableRow', () => {
  it('renders the table row cells correctly', async () => {
    const cells = ['Cell 1', 'Cell 2', 'Cell 3'];

    await act(async () => {
      render(<TableRow rowData={cells} />);
    });

    cells.forEach((cell) => {
      expect(screen.getByText(cell)).toBeInTheDocument();
    });
  });

  it('applies the correct grid class based on the number of cells', async () => {
    const cells = ['Cell 1', 'Cell 2', 'Cell 3'];

    await act(async () => {
      render(<TableRow rowData={cells} />);
    });

    const ulElement = screen.getByRole('list');
    expect(ulElement).toHaveClass('grid-cols-3');
  });

  it('renders nothing when no cells are provided', async () => {
    await act(async () => {
      render(<TableRow rowData={[]} />);
    });

    const ulElement = screen.getByRole('list');
    expect(ulElement).toBeEmptyDOMElement();
  });
});
