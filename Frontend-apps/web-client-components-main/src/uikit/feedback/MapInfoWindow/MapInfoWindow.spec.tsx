import React from 'react';
import { screen, render } from '@testing-library/react';
import MapInfoWindow from './MapInfoWindow';

// Mock the InfoWindow component from @react-google-maps/api
jest.mock('@react-google-maps/api', () => ({
  InfoWindow: jest.fn((props: any) => (
    <div data-testid="google-map-infowindow" {...props}></div>
  ))
}));

const mockInfoWindow = jest.requireMock('@react-google-maps/api').InfoWindow;

describe('MapInfoWindow component', () => {
  const position = { lat: 0, long: 0 };
  const businessInfo = {
    name: 'Test Business',
    tradeName: 'Trade Name',
    rut: '12345678-9',
    address: '123 Test St',
    territoryName: 'Test Territory',
    visitGroup: 'Group A',
    visitDay: 'Monday',
    salesRepName: 'John Doe',
    recentPurchases: true
  };

  const mockOnClose = jest.fn();

  beforeAll(() => {
    global.window.google = {
      maps: {
        Size: jest.fn()
      }
    } as any;
  });

  afterEach(() => {
    mockInfoWindow.mockClear();
    mockOnClose.mockClear();
  });

  it('renders the InfoWindow component', () => {
    render(
      <MapInfoWindow
        position={position}
        businessInfo={businessInfo}
        onClose={mockOnClose}
      />
    );
    const infoWindowElement = screen.getByTestId('google-map-infowindow');
    expect(infoWindowElement).toBeInTheDocument();
  });

  it('displays business information correctly', () => {
    render(
      <MapInfoWindow
        position={position}
        businessInfo={businessInfo}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Test Business')).toBeInTheDocument();
    expect(screen.getByText('Trade Name')).toBeInTheDocument();
    expect(screen.getByText('12345678-9')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
    expect(screen.getByText('Test Territory')).toBeInTheDocument();
    expect(screen.getByText('Group A')).toBeInTheDocument();
    expect(screen.getByText('Monday')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays recent purchase indicator when recentPurchases is true', () => {
    render(
      <MapInfoWindow
        position={position}
        businessInfo={businessInfo}
        onClose={mockOnClose}
      />
    );
    expect(screen.getByText('Cliente con compra reciente')).toBeInTheDocument();
  });

  it('does not display recent purchase indicator when recentPurchases is false', () => {
    businessInfo.recentPurchases = false;
    render(
      <MapInfoWindow
        position={position}
        businessInfo={businessInfo}
        onClose={mockOnClose}
      />
    );
    expect(screen.queryByText('Cliente con compra reciente')).toBeNull();
  });
});
