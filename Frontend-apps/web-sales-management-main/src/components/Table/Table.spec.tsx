import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Table, { TableProps } from './Table';

describe('Table', () => {
  it('renders the TableTable with given labels', async () => {
    await act(async () => {
      render(<Table headerLabels={['Label1', 'Label2']} />);
    });

    expect(screen.getByText('Label1')).toBeInTheDocument();
    expect(screen.getByText('Label2')).toBeInTheDocument();
  });

  it('renders the TableRows with given data', async () => {
    await act(async () => {
      render(
        <Table
          tableRows={[
            ['Row1Data1', 'Row1Data2'],
            ['Row2Data1', 'Row2Data2']
          ]}
        />
      );
    });

    expect(screen.getByText('Row1Data1')).toBeInTheDocument();
    expect(screen.getByText('Row1Data2')).toBeInTheDocument();
    expect(screen.getByText('Row2Data1')).toBeInTheDocument();
    expect(screen.getByText('Row2Data2')).toBeInTheDocument();
  });
});
