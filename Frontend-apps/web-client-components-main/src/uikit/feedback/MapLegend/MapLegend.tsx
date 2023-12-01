import React from 'react';
import classNames from 'classnames';
import MapLegendItem, { type MapLegendItemProps } from './MapLegendItem';

export interface MapLegendProps {
  title: string;
  items: MapLegendItemProps[];
  className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ title, items, className }) => {
  return (
    <div
      className={classNames(
        'flex flex-col gap-2.5 p-4 bg-white rounded-2xl',
        className
      )}
      data-testid="adelco-map-legend"
    >
      <h3 className="font-body font-semibold text-xs text-corporative-03">
        {title}
      </h3>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <MapLegendItem key={item.label} {...item} />
        ))}
      </ul>
    </div>
  );
};

export default MapLegend;
