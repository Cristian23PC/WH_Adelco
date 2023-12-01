'use client';
import React, { FC, useEffect, useRef, useState } from 'react';
import { LoadScript, GoogleMap } from '@react-google-maps/api';
import { mapStyles } from './mapStyles';
import { type MapVisit, MapBusinessInfo } from './types';
import { MapMarker } from './partials/MapMarker';
import { MapInfoWindow } from './partials/MapInfoWindow';
import { noVisitCode } from '@/app/(management)/clients/partials/visitPlanner/utils';

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';
const MAX_AUTO_ZOOM = 14;

export interface ClientMapProps {
  visits: MapVisit[];
}

const ClientMap: FC<ClientMapProps> = ({ visits = [] }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const nativeMapRef = useRef<google.maps.Map | null>(null);
  const [selectedBU, setSelectedBU] = useState<MapBusinessInfo | null>();
  const [defaultCoordinates] = useState({
    lat: -33.4172,
    lng: -70.6306
  });

  useEffect(() => {
    if (nativeMapRef.current && mapLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      if (visits.length === 0) {
        bounds.extend(defaultCoordinates);
      }

      visits?.forEach((visit) => {
        if (visit.businessInfo.coordinates) {
          bounds.extend(visit.businessInfo.coordinates);
        }
      });
      nativeMapRef.current.fitBounds(bounds);

      const currentZoom = nativeMapRef.current.getZoom();
      if (!currentZoom || currentZoom > MAX_AUTO_ZOOM) {
        nativeMapRef.current.setZoom(MAX_AUTO_ZOOM);
      }
    }
  }, [visits, mapLoaded, defaultCoordinates]);

  return (
    <div className="rounded-[24px]">
      <LoadScript id="google-map-id" googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          onLoad={(map) => {
            nativeMapRef.current = map;
            setMapLoaded(true);
          }}
          mapContainerStyle={{
            width: '100%',
            height: '100%',
            borderRadius: '24px'
          }}
          center={defaultCoordinates}
          zoom={12}
          options={{
            disableDefaultUI: true,
            styles: mapStyles
          }}
        >
          {visits.map((visit, index) => {
            if (visit.businessInfo.coordinates) {
              return (
                <MapMarker
                  key={index}
                  color={visit.color}
                  position={visit.businessInfo.coordinates}
                  onClick={() => {
                    setSelectedBU(null);
                    // workaroud to force InfoWindow reappers
                    setTimeout(() => {
                      setSelectedBU(visit.businessInfo);
                    }, 0);
                  }}
                />
              );
            }
          })}
          {selectedBU?.coordinates && (
            <MapInfoWindow
              position={selectedBU?.coordinates}
              businessInfo={selectedBU}
              onClose={() => {
                setSelectedBU(null);
              }}
            ></MapInfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default ClientMap;
