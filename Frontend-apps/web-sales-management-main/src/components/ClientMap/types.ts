export interface Coordinates {
  lat: number;
  lng: number;
}

export interface MapBusinessInfo {
  coordinates?: Coordinates;
  name: string;
  tradeName: string;
  rut: string;
  address: string;
  territoryName: string;
  visitGroup: string;
  visitDay: string;
  salesRepName: string;
  recentPurchases: boolean;
  noVisit?: boolean;
}

export interface Map {
  coordinates?: Coordinates;
  markerLabel?: string;
  className?: string;
  onDragEnd: ({ lat, lng }: Coordinates) => void;
  apiKey?: string;
}

export interface MapInfoWindow {
  position: Coordinates;
  businessInfo: MapBusinessInfo;
  onClose: VoidFunction;
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

export interface MapVisit {
  frequencyCode: number;
  date: Date;
  color?: string;
  businessInfo: MapBusinessInfo;
}
