import React from 'react';
import { screen, render } from '@testing-library/react';
import MapMarker from './MapMarker';

jest.mock('@react-google-maps/api', () => ({
  Marker: jest.fn((props: any) => (
    <div data-testid="google-map-marker" {...props}></div>
  ))
}));

const mockMarker = jest.requireMock('@react-google-maps/api').Marker;

describe('MapMarker component', () => {
  afterEach(() => {
    mockMarker.mockClear();
  });

  it('renders the Marker component', () => {
    const position = { lat: 0, long: 0 };
    render(<MapMarker position={position} />);
    const markerElement = screen.getByTestId('google-map-marker');
    expect(markerElement).toBeInTheDocument();
  });

  it('uses custom icon when customIcon prop is true', () => {
    const position = { lat: 0, long: 0 };
    render(<MapMarker position={position} customIcon={true} />);
    expect(
      mockMarker.mock.calls[0][0].icon.url.includes(
        'data-testid%3D%22marker-icon%22%'
      )
    ).toBeTruthy();
  });

  it('does not use custom icon when customIcon prop is false', () => {
    const position = { lat: 0, long: 0 };
    render(<MapMarker position={position} customIcon={false} />);
    expect(
      mockMarker.mock.calls[0][0].icon?.url?.includes(
        'data-testid%3D%22marker-icon%22%'
      )
    ).toBeFalsy();
  });
});
