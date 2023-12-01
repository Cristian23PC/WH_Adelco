import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SortMenu, { type SortMenuProps } from './SortMenu';
import { type Option } from './types';

describe('SortMenu', () => {
  const sortList: Option[] = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' }
  ];
  const defaultProps: SortMenuProps = {
    title: 'Sort Menu',
    open: true,
    sortList,
    onClose: jest.fn(),
    onApply: jest.fn(),
    onSelect: jest.fn()
  };

  test('renders the title correctly', () => {
    render(<SortMenu {...defaultProps} />);
    expect(screen.getByText('Sort Menu')).toBeInTheDocument();
  });

  test('renders the options correctly', () => {
    render(<SortMenu {...defaultProps} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  test('calls the onClose function when close button is clicked', () => {
    const onClose = jest.fn();
    render(<SortMenu {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('adelco-filter-menu-close'));
    expect(onClose).toHaveBeenCalled();
  });

  test('calls the onSelect function when an option is selected', () => {
    const onSelect = jest.fn();
    render(<SortMenu {...defaultProps} onSelect={onSelect} />);
    fireEvent.click(screen.getByText('Option 1'));
    expect(onSelect).toHaveBeenCalledWith('option1');
  });

  test('calls the onApply function when apply button is clicked', () => {
    const onApply = jest.fn();
    render(<SortMenu {...defaultProps} onApply={onApply} />);
    fireEvent.click(screen.getByText('Aplicar'));
    expect(onApply).toHaveBeenCalled();
  });
});
