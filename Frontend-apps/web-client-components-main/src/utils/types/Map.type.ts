export interface Coordinates {
  lat: number;
  long: number;
}

export interface MapCoordinates {
  lat: number;
  lng: number;
}

export interface Map {
  coordinates: Coordinates;
  markerLabel?: string;
  className?: string;
  onDragEnd: ({ lat, long }: Coordinates) => void;
  apiKey?: string;
}

export interface MapMarker {
  position: Coordinates;
  customIcon?: boolean;
  color?: string;
  className?: string;
  draggable?: boolean;
  onDragEnd?: (e: google.maps.MapMouseEvent) => void;
  onClick?: VoidFunction;
}

export interface MapBusinessInfo {
  name: string;
  tradeName: string;
  rut: string;
  address: string;
  territoryName: string;
  visitGroup: string;
  visitDay: string;
  salesRepName: string;
  recentPurchases: boolean;
}

export interface MapInfoWindow {
  position: Coordinates;
  businessInfo: MapBusinessInfo;
  onClose: VoidFunction;
}
