import React, { useEffect, useRef, useState } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import MapMarker from './MapMarker';
import type {
  MapBusinessInfo,
  MapCoordinates
} from '../../../utils/types/Map.type';
import { mapStyles } from './mapStyles';
import { MapInfoWindow } from '../MapInfoWindow';

let googleMapsApiKey: string | undefined =
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const colors = [
  '#FCE300',
  '#FF964A',
  '#FB3E3E',
  '#5AC648',
  '#3E96E8',
  '#9288FF',
  '#ED7BFF'
  // '#CCCCCC',
];

export interface MapDemoProps {
  coordinates: MapCoordinates[];
  className?: string;
  businessInfo: MapBusinessInfo;
}

const MapDemo: React.FC<MapDemoProps> = ({
  coordinates,
  className,
  businessInfo
}) => {
  const nativeMapRef = useRef<google.maps.Map | null>(null);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<MapCoordinates | null>();

  if (typeof googleMapsApiKey !== 'string') {
    googleMapsApiKey = '';
  }

  useEffect(() => {
    if (nativeMapRef.current && mapLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      coordinates.forEach((coordinate) => {
        bounds.extend(coordinate);
      });
      nativeMapRef.current.fitBounds(bounds);
    }
  }, [coordinates, mapLoaded]);

  return (
    <div className={className}>
      <LoadScript id="google-map-id" googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          onLoad={(map) => {
            nativeMapRef.current = map;
            setMapLoaded(true);
          }}
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            borderRadius: '16px'
          }}
          center={coordinates[0]}
          zoom={12}
          options={{
            disableDefaultUI: true,
            styles: mapStyles
          }}
        >
          {coordinates.map((coordinate, index) => (
            <MapMarker
              key={index}
              color={colors[index % colors.length]}
              position={{
                lat: coordinate.lat,
                long: coordinate.lng
              }}
              onClick={() => {
                console.log(coordinates[index]);
                setSelectedLocation(null);
                // workaroud to force InfoWindow reappers
                setTimeout(() => {
                  setSelectedLocation(coordinates[index]);
                }, 0);
              }}
            />
          ))}

          {selectedLocation && (
            <MapInfoWindow
              position={{
                lat: selectedLocation.lat,
                long: selectedLocation.lng
              }}
              businessInfo={businessInfo}
              onClose={() => {
                setSelectedLocation(null);
              }}
            ></MapInfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapDemo;
