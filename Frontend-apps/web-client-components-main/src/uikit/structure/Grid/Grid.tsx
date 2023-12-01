import React from 'react';
import classNames from 'classnames';
import {
  mobileColsMapper,
  mobileGapMapper,
  tabletColsMapper,
  tabletGapMapper,
  desktopColsMapper,
  desktopGapMapper
} from './utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  'data-testid'?: string;
  products?: any[];
  className?: string;
  mobileCols?: 1 | 2;
  tabletCols?: 1 | 2 | 3 | 4 | 5 | 6;
  desktopCols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  mobileGap?: 1 | 2 | 3 | 4 | 5 | 6;
  tabletGap?: 1 | 2 | 3 | 4 | 5 | 6;
  desktopGap?: 1 | 2 | 3 | 4 | 5 | 6;
  desktopMaxWidthLimited?: boolean;
}

const Grid: React.FC<GridProps> = ({
  'data-testid': dataTestId = 'adelco-product-grid',
  className,
  products,
  mobileCols = 2,
  tabletCols = 4,
  desktopCols = 5,
  mobileGap = 4,
  tabletGap = 4,
  desktopGap = 2,
  desktopMaxWidthLimited = true,
  children
}) => {
  return (
    <div
      data-testid={dataTestId}
      className={classNames(
        'grid items-stretch',
        mobileColsMapper[mobileCols],
        mobileGapMapper[mobileGap],
        tabletColsMapper[tabletCols],
        tabletGapMapper[tabletGap],
        desktopColsMapper[desktopCols],
        desktopGapMapper[desktopGap],
        className
      )}
    >
      {children}
    </div>
  );
};

export default Grid;
