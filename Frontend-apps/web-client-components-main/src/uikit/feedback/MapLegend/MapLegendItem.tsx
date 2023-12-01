import React from 'react';
import classNames from 'classnames';

export interface MapLegendItemProps {
  color: string;
  label: string;
  className?: string;
}

const MapLegendItem: React.FC<MapLegendItemProps> = ({
  label,
  color,
  className
}) => {
  return (
    <li className={classNames('flex gap-2 items-center', className)}>
      <div
        className="h-2 w-2 min-w-[0.5rem] rounded-full"
        style={{ backgroundColor: color }}
        data-testid="adelco-map-legend-item-dot"
      />
      <span
        className="font-body text-xs font-normal text-corporative-02-hover"
        style={{ wordBreak: 'break-word' }}
      >
        {label}
      </span>
    </li>
  );
};

export default MapLegendItem;
