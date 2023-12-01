import React, { type FC } from 'react';
import { UPDATE_CART } from '../iconNames';
import type Props from './IconPropType';

const UpdateCartIcon: FC<Props> = ({
  'data-testid': dataTestId = `icon-${UPDATE_CART}`,
  className,
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 50 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      className={className}
      data-testid={dataTestId}
    >
      <path
        className={className}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.725 46.0754C34.5 46.0754 42.45 38.2254 42.45 28.6004C42.45 25.2504 46.95 25.5004 46.95 28.6004C46.95 40.6754 36.975 50.5004 24.725 50.5004C12.475 50.5004 2.5 40.3504 2.5 28.6004C2.5 16.8504 11.9 7.25039 23.7 6.70039L21.225 4.27539C20.35 3.42539 20.35 2.02539 21.225 1.15039C22.1 0.275391 23.525 0.275391 24.4 1.15039L30.7 7.32539C31.125 7.75039 31.35 8.30039 31.35 8.90039C31.35 9.50039 31.125 10.0504 30.7 10.4754L24.425 16.6754C23.975 17.1004 23.4 17.3254 22.825 17.3254C22.25 17.3254 21.675 17.1004 21.225 16.6754C20.35 15.8254 20.35 14.4254 21.225 13.5504L23.625 11.1754C14.35 11.7254 7 18.9754 7 28.6004C7 38.2254 14.95 46.0754 24.725 46.0754ZM30.175 41.6004C28.7 41.6004 27.525 40.4004 27.525 38.9504C27.525 37.5004 28.725 36.3004 30.175 36.3004C31.625 36.3004 32.825 37.5004 32.825 38.9504C32.825 40.4004 31.65 41.6004 30.175 41.6004ZM17.8 38.9504C17.8 40.4004 18.975 41.6004 20.45 41.6004C21.925 41.6004 23.1 40.4004 23.1 38.9504C23.1 37.5004 21.9 36.3004 20.45 36.3004C19 36.3004 17.8 37.5004 17.8 38.9504ZM13.9 19.4254H18.225H18.25L19.175 21.3754H33.1C33.7 21.3754 34.25 21.6754 34.55 22.2004C34.85 22.7254 34.85 23.3504 34.55 23.8754L31.075 30.1754C30.625 31.0254 29.725 31.5504 28.75 31.5504H21.925L21.625 32.0754H32.8V35.4254H20.425C19.475 35.4254 18.625 34.9254 18.15 34.1254C17.65 33.3004 17.65 32.3004 18.1 31.4754L19.25 29.4254L16.1 22.7754H13.9V19.4254ZM28.325 28.1754L30.225 24.7254H20.75L22.375 28.1754H28.325Z"
        fill="#1D1D1B"
      />
    </svg>
  );
};

export default UpdateCartIcon;