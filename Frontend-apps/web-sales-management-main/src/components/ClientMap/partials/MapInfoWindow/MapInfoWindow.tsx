import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { type MapInfoWindow as MapInfoWindowProp } from '../../types';

const MapInfoWindow: React.FC<MapInfoWindowProp> = ({
  position,
  businessInfo,
  onClose
}) => {
  return (
    <InfoWindow
      position={position}
      onCloseClick={onClose}
      options={{ pixelOffset: new window.google.maps.Size(0, -30) }}
    >
      <div className="w-[250px]">
        <ul className="font-body">
          <li className="font-semibold text-sm">{businessInfo.name}</li>
          <li className="font-semibold text-xs">{businessInfo.tradeName}</li>
          <li className="text-moon">{businessInfo.rut}</li>
          <li className="text-moon">{businessInfo.address}</li>
          <hr className="my-2" />
          <li className="flex justify-between">
            <p className="font-semibold text-moon">Territorio</p>
            <p className="text-right">{businessInfo.territoryName}</p>
          </li>
          {!businessInfo.noVisit && (
            <>
              <li className="flex justify-between">
                <p className="font-semibold text-moon">Grupo</p>
                <p className="text-right">{businessInfo.visitGroup}</p>
              </li>
              <li className="flex justify-between">
                <p className="font-semibold text-moon">Día</p>
                <p className="text-right">{businessInfo.visitDay}</p>
              </li>
            </>
          )}
          <li className="flex justify-between">
            <p className="font-semibold text-moon">Vendedor</p>
            <p className="text-right truncate ml-2">
              {businessInfo.salesRepName}
            </p>
          </li>
          {businessInfo.recentPurchases && (
            <>
              <hr className="my-2" />
              <li className="flex items-center py-1">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="8" cy="8" r="8" fill="#F3F4F9" />
                  <circle cx="8.0125" cy="8.0125" r="3.2" fill="#2ECC71" />
                </svg>
                <span className="ml-2">Cliente con compra reciente</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </InfoWindow>
  );
};

export default MapInfoWindow;
