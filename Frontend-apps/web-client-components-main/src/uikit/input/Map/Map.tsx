import React, { useEffect, useState } from 'react';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import type { Map as MapProps } from '../../../utils/types';

let googleMapsApiKey: string | undefined =
  process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const Map: React.FC<MapProps> = ({
  coordinates,
  markerLabel = 'Tienda',
  className,
  onDragEnd,
  apiKey
}) => {
  const [localCoordinates, setLocalCoordinates] = useState(coordinates);

  if (typeof googleMapsApiKey !== 'string') {
    googleMapsApiKey = '';
  }

  useEffect(() => {
    setLocalCoordinates(coordinates);
  }, [coordinates]);

  const handleDragEnd = (e: google.maps.MapMouseEvent): void => {
    const lat = e.latLng?.lat() as number;
    const long = e.latLng?.lng() as number;
    setLocalCoordinates({ lat, long });
    onDragEnd({ lat, long });
  };

  return (
    <div className={className}>
      <LoadScript
        id="google-map-id"
        googleMapsApiKey={apiKey ?? googleMapsApiKey}
      >
        <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            borderRadius: '16px'
          }}
          center={{
            lat: localCoordinates?.lat ?? 0,
            lng: localCoordinates?.long ?? 0
          }}
          zoom={18}
          options={{
            disableDefaultUI: true
          }}
        >
          <Marker
            title={markerLabel}
            draggable={true}
            onDragEnd={handleDragEnd}
            position={{
              lat: localCoordinates?.lat ?? 0,
              lng: localCoordinates?.long ?? 0
            }}
          />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
