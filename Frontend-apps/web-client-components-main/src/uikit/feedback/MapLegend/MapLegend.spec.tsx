import React from 'react';
import { render, screen } from '@testing-library/react';
import MapLegend from './MapLegend';

describe('MapLegend component', () => {
  const mockItems = [
    { color: 'red', label: 'Label 1' },
    { color: 'blue', label: 'Label 2' }
  ];

  it('should render the title correctly', () => {
    render(<MapLegend title="Legend" items={[]} />);

    expect(screen.getByText('Legend')).toBeInTheDocument();
  });

  it('should render legend items with color and label', () => {
    render(<MapLegend title="Legend" items={mockItems} />);

    mockItems.forEach((item, i) => {
      const colorDot = screen.getAllByTestId('adelco-map-legend-item-dot')[i];
      const label = screen.getByText(item.label);

      expect(label).toBeInTheDocument();
      expect(colorDot).toBeInTheDocument();
      expect(colorDot).toHaveStyle(`background-color: ${item.color};`);
    });
  });

  it('should apply custom class name to the container', () => {
    render(<MapLegend title="Legend" items={[]} className="custom-class" />);
    expect(screen.getByTestId('adelco-map-legend')).toHaveClass('custom-class');
  });

  it('should apply custom class name to each legend item', () => {
    const customClassName = 'custom-legend-item';
    render(
      <MapLegend
        title="Legend"
        items={mockItems.map((item) => ({
          ...item,
          className: customClassName
        }))}
      />
    );

    mockItems.forEach((_, i) => {
      const legendItem = screen.getAllByRole('listitem')[i];
      expect(legendItem).toHaveClass(customClassName);
    });
  });
});
