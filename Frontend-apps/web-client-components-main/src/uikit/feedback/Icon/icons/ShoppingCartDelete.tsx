import React, { type FC } from 'react';
import { SHOPPING_CART_DELETE } from '../iconNames';
import type Props from './IconPropType';

const ShoppingCartDeleteIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${SHOPPING_CART_DELETE}`,
  className,
  width = 20,
  height = 20,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
      data-testid={dataTestId}
      width={width}
      height={height}
    >
      <g clipPath="url(#clip0_2291_5252)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.8339 3.40815L19.78 1.38219L18.34 -0.0078125L1 18.0122L2.44 19.4022L5.01 16.7322C5.04 17.6222 5.76 18.3422 6.66 18.3422C7.56 18.3422 8.33 17.5922 8.33 16.6722C8.33 15.7522 7.58 15.0022 6.66 15.0022L7.46 14.1722H16.66V12.5022H9.07L10.67 10.8322H13.78C14.4 10.8322 14.95 10.4922 15.24 9.97219L18.22 4.56219C18.4673 4.11705 18.2547 3.59364 17.8339 3.40815ZM12.28 9.17219H13.79L15.82 5.49219L12.28 9.17219ZM6.32625 9.67188L5.20625 11.7019C5.09625 11.9119 5.04625 12.1219 5.02625 12.3419L8.06625 9.18188H7.94625L5.96625 5.01188H12.0763L13.6763 3.34188H5.16625L4.38625 1.67188H1.65625V3.34188H3.32625L6.32625 9.66187V9.67188ZM15.0037 15.0078C14.0837 15.0078 13.3438 15.7578 13.3438 16.6778C13.3438 17.5978 14.0837 18.3478 15.0037 18.3478C15.9237 18.3478 16.6737 17.5978 16.6737 16.6778C16.6737 15.7578 15.9237 15.0078 15.0037 15.0078Z"
          fill="#1D1D1B"
          className={className}
        />
      </g>
      <defs>
        <clipPath id="clip0_2291_5252">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ShoppingCartDeleteIcon;
