import React from 'react';
import { render } from '@testing-library/react';
import MapComponent from './Map';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';

describe('MapComponent', () => {
  it('passes className to div', () => {
    const handleDragEnd = jest.fn();
    const coordinates = { lat: 0, long: 0 };

    const { container } = render(
      <MapComponent
        coordinates={coordinates}
        className="map-class"
        onDragEnd={handleDragEnd}
      />
    );

    expect(container.firstChild).toHaveClass('map-class');
  });
});
